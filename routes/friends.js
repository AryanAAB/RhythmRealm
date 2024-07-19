const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserFriends = require("../models/UserFriends");

router.post('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { recipient, message } = req.body;
        
        const recipientUser = await User.findOne({ username: recipient });
        
        if (!recipientUser) {
            return res.status(404).send({ error: 'Recipient not found' });
        }

        const newMessage = new UserFriends({
            sender,
            recipient: recipientUser,
            message
        });

        await newMessage.save();
        res.status(201).send(newMessage);
    } catch (error) {
        res.status(400).send({ error: 'Failed to send message' });
    }
});

router.post('/respond/:id', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { id } = req.params;
        const { accepted } = req.body;

        const message = await UserFriends.findById(id);
        
        message.accepted = accepted;
        await message.save();
        res.status(200).json({ message: 'Response recorded successfully.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to respond to message.' });
    }
});

router.get('/sent', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sentMessages = await UserFriends.find({ sender: sender })
                                            .sort({ updatedAt: -1 })
                                            .populate('sender')
                                            .populate('recipient')
                                            .exec();

        res.status(200).json({
            message: sentMessages,
        });

    } catch (error) {
        res.status(400).send({ error: 'Failed to get messages' });
    }
});

router.get('/received', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const receivedMessages = await UserFriends.find({ recipient: sender, accepted: null })
                                                .sort({ updatedAt: -1 })
                                                .populate('sender')
                                                .populate('recipient')
                                                .exec();

        res.status(200).json({
            message: receivedMessages,
        });

    } catch (error) {
        res.status(400).send({ error: 'Failed to get messages' });
    }
});

router.get('/archived', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const archivedMessages = await UserFriends.find({ recipient: sender, accepted: { $ne: null } })
                                                .sort({ updatedAt: -1 })
                                                .populate('sender')
                                                .populate('recipient')
                                                .exec();

        res.status(200).json({
            message: archivedMessages,
        });

    } catch (error) {
        res.status(400).send({ error: 'Failed to get messages' });
    }
});

module.exports = router;