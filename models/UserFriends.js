const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
