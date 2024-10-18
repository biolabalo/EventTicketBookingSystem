const express = require("express");
const { Event, Booking, WaitingList } = require("../models");
const { sequelize } = require("../db");
const logger = require("../utils/logger");
const { 
    initializeValidation, 
    bookValidation, 
    cancelValidation, 
    statusValidation 
  } = require('../middleware/validations');
  
const router = express.Router();

// Initialize a new event
router.post("/initialize", initializeValidation, async (req, res) => {
  const { name, totalTickets } = req.body;
  try {
    const event = await Event.create({
      name,
      totalTickets,
      availableTickets: totalTickets,
    });
    logger.info(`Event initialized: ${event.id}`, { eventId: event.id });
    res.status(201).json(event);
  } catch (error) {
    logger.error("Event initialization failed", { error: error.message });

    res.status(400).json({ error: error.message });
  }
});

// Book a ticket
router.post("/book", bookValidation, async (req, res) => {
  const { eventId, userId } = req.body;
  const t = await sequelize.transaction();

  try {
    const event = await Event.findByPk(eventId, { transaction: t, lock: true });
    if (!event) {
      throw new Error("Event not found");
    }

    if (event.availableTickets > 0) {
      await Booking.create({ eventId,  }, { transaction: t });
      event.availableTickets -= 1;
      await event.save({ transaction: t });
      await t.commit();
      logger.info(`Ticket booked`, {  eventId });
      res.status(201).json({ message: "Ticket booked successfully" });
    } else {
      await WaitingList.create({ eventId,  }, { transaction: t });
      await t.commit();
      logger.info(`Added to waiting list`, {  eventId });
      res.status(202).json({ message: "Added to waiting list" });
    }
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Cancel a booking
router.post("/cancel", cancelValidation, async (req, res) => {
  const { eventId, userId } = req.body;
  const t = await sequelize.transaction();

  try {
    const booking = await Booking.findOne({
      where: { eventId, userId },
      transaction: t,
    });
    if (!booking) {
      throw new Error("Booking not found");
    }

    await booking.destroy({ transaction: t });

    const event = await Event.findByPk(eventId, { transaction: t, lock: true });
    event.availableTickets += 1;
    await event.save({ transaction: t });

    const waitingUser = await WaitingList.findOne({
      where: { eventId },
      transaction: t,
    });
    if (waitingUser) {
      await Booking.create(
        { eventId, userId: waitingUser.userId },
        { transaction: t }
      );
      await waitingUser.destroy({ transaction: t });
      event.availableTickets -= 1;
      await event.save({ transaction: t });
    }

    await t.commit();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    await t.rollback();
    res.status(400).json({ error: error.message });
  }
});

// Get event status
router.get("/status/:eventId", statusValidation, async (req, res) => {
  const { eventId } = req.params;
  try {
    const event = await Event.findByPk(eventId);
    if (!event) {
      throw new Error("Event not found");
    }
    const waitingListCount = await WaitingList.count({ where: { eventId } });
    res.status(200).json({
      availableTickets: event.availableTickets,
      waitingListCount,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
