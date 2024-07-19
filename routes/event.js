const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require("../models/Event");
const User = require("../models/User");

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        
        const date = new Date();
        const events = await Event.find({dateTime: {$gt: date}}).populate('createdBy').populate('rsvps').exec();
        const archived = await Event.find({dateTime: {$lte: new Date()}}).populate('createdBy').populate('rsvps').exec();
        res.status(200).json({
            events: events,
            archived: archived,
            userId: req.user.userId
        });
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

});

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

router.delete('/:id', async (req, res) => {
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

    const { id } = req.params;
    try {
        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this event' });
        }
        await Event.deleteOne({ _id: id });
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to delete event' });
    }
});

router.post('/:id/rsvp', async (req, res) => {
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

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'RSVP successful', username: user.username });
    } catch (error) {
        res.status(400).json({ error: 'Failed to RSVP for event' });
    }
});

module.exports = router;