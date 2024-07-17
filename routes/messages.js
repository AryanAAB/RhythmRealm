const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserMessage = require("../models/UserMessage");

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

        const newMessage = new UserMessage({
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

router.get('/', async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const sender = await User.findById(decoded.userId);

        if (!sender) {
            return res.status(404).json({ message: 'User not found' });
        }

        const sentMessages = await UserMessage.find({sender: sender}).populate().exec();
        const receivedMessages = await UserMessage.find({recipient: sender, accepted: null}).populate().exec();
        const archivedMessages = await UserMessage.find({recipient: sender, accepted: {$ne: null}}).populate().exec();

    }catch (error) {
        res.status(400).send({ error: 'Failed to get messages' });
    }
});

module.exports = router;