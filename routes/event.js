const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require("../models/Event");

router.post('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    const { name, location, typeOfPeopleRequired, dateTime, additionalInfo } = req.body;
    try {
        const event = new Event({
            name,
            location,
            typeOfPeopleRequired,
            dateTime,
            additionalInfo,
            createdBy: req.user.userId
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create event' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, location, typeOfPeopleRequired, dateTime, additionalInfo } = req.body;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this event' });
        }
        event.name = name || event.name;
        event.location = location || event.location;
        event.typeOfPeopleRequired = typeOfPeopleRequired || event.typeOfPeopleRequired;
        event.dateTime = dateTime || event.dateTime;
        event.additionalInfo = additionalInfo || event.additionalInfo;
        await event.save();
        res.status(200).json(event);
    } catch (error) {
        res.status(400).json({ error: 'Failed to edit event' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }
        await event.remove();
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete event' });
    }
});

router.post('/:id/rsvp', async (req, res) => {
    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (!event.rsvps.includes(req.user.userId)) {
            event.rsvps.push(req.user.userId);
            await event.save();
        }
        res.status(200).json({ message: 'RSVP successful' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to RSVP for event' });
    }
});

module.exports = router;