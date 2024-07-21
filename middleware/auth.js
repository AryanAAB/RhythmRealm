const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify the user's token and authenticate the user.
 * 
 * This function checks for a token in the Authorization header of the request.
 * If a token is found, it verifies the token using the secret key. If the token 
 * is valid, it fetches the user's information from the database (excluding the password)
 * and attaches it to the `req.user` object. If no token is provided or the token is 
 * invalid, it sends an appropriate error response.
 * 
 * @param {*} req - The request object containing the HTTP request information.
 * @param {*} res - The response object to send the HTTP response.
 * @param {*} next - The next middleware function in the stack.
 * @returns {Object} - The response message or the next middleware function call.
 */
const verifyToken = async (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = verifyToken;
