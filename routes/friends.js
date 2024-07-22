const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require("../models/User");
const UserFriends = require("../models/UserFriends");

/**
 * Route to send a friend request to a recipient user.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * identify the sender. The route checks if the sender and the recipient exist in 
 * the database. If both users are found, it creates a new message and saves it 
 * to the database. If the token is missing or invalid, if the sender or recipient 
 * is not found, or if there is an error during the message sending process, it 
 * sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */ 
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

/**
 * Route to respond to a friend request by its ID.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * identify the sender. The route checks if the sender exists in the database. If 
 * the sender is found, it updates the acceptance status of the specified message 
 * and saves the changes to the database. If the token is missing or invalid, if 
 * the sender or message is not found, or if there is an error during the response 
 * process, it sends an appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to get all sent messages by the authenticated user.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * identify the sender. The route checks if the sender exists in the database. If 
 * the sender is found, it retrieves all messages sent by the sender, sorts them 
 * by the most recently updated, populates the sender and recipient details, and 
 * sends them in the response. If the token is missing or invalid, if the sender 
 * is not found, or if there is an error during the retrieval process, it sends an 
 * appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to get all received friend requests for the authenticated user that are 
 * not yet accepted.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * identify the sender. The route checks if the sender exists in the database. If 
 * the sender is found, it retrieves all messages where the authenticated user is 
 * the recipient and the message is not yet accepted, sorts them by the most 
 * recently updated, populates the sender and recipient details, and sends them 
 * in the response. If the token is missing or invalid, if the sender is not found, 
 * or if there is an error during the retrieval process, it sends an appropriate 
 * error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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

/**
 * Route to get all archived friennd requests for the authenticated user.
 * 
 * This route requires a valid JWT token for authentication. It extracts the token 
 * from the Authorization header, verifies it, and uses the decoded user ID to 
 * identify the sender. The route checks if the sender exists in the database. If 
 * the sender is found, it retrieves all messages where the authenticated user is 
 * the recipient and the message has been accepted/declined (i.e., `accepted` is not null), 
 * sorts them by the most recently updated, populates the sender and recipient details, 
 * and sends them in the response. If the token is missing or invalid, if the sender 
 * is not found, or if there is an error during the retrieval process, it sends an 
 * appropriate error response.
 * 
 * @param {Object} req - The request object containing the HTTP request information.
 * @param {Object} res - The response object to send the HTTP response.
 */
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