const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Creates a user friend schema that specifies the structure of a user friend document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the events collection in the database. Each friend connection has a 
 * sender who first asked to be a friend, a recipient who is the receiver of the 
 * friend request, the message sent, and whether or not the friend request was accepted
 * or not.
 */
const friendSchema = new Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    accepted: {
        type: Boolean,
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('friends', friendSchema);
