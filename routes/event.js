const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Event = require("../models/Event");
const User = require("../models/User");

/**
 * Route to get the current and archived events.
 * 
 * This route requires a valid JWT token for authentication. It fetches events 
 * from the database where the event date is in the future (current events) and 
 * where the event date is in the past or present (archived events). The events 
 * are populated with the details of the user who created them and the users who 
 * have RSVPed. The response includes the current and archived events, as well as 
 * the ID of the authenticated user.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to create a new event.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to set 
 * the creator of the event. It then creates a new event with the provided details 
 * (name, location, type of people required, date and time, additional info) and 
 * saves it to the database. If successful, it responds with the created event. 
 * If the token is missing or invalid, or if there is an error creating the event, 
 * it sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */ 
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

/**
 * Route to delete an event by its ID.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * authorize the deletion of the event. The route checks if the event exists and 
 * if the requesting user is the creator of the event. If both conditions are met, 
 * it deletes the event from the database and responds with a success message. If 
 * the token is missing or invalid, if the event is not found, or if the user is 
 * not authorized to delete the event, it sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */ 
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

/**
 * Route to RSVP for an event by its ID.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * add the user to the RSVPs list of the specified event. The route checks if the 
 * event exists and if the user has not already RSVPed for the event. If the 
 * conditions are met, it adds the user to the RSVPs list and saves the event. 
 * It also verifies that the user exists in the database and responds with a 
 * success message including the username. If the token is missing or invalid, 
 * if the event or user is not found, or if there is an error during the RSVP 
 * process, it sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */ 
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