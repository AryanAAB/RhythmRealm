const mongoose = require('mongoose');

/**
 * Creates an event schema that specifies the structure of an event document in MongoDB.
 * 
 * This schema defines the fields and their types, along with any necessary validation
 * rules for the events collection in the database. Each event has a name, location, 
 * type of people required, date and time, additional information, the creator's ID, 
 * and a list of users who have RSVPed.
 */
const EventSchema = new mongoose.Schema({
    //the name of the event
    name: {
        type: String,
        required: true
    },
    //the location where the event is held
    location: {
        type: String,
        required: true
    },
    //the specialists who are required
    typeOfPeopleRequired: {
        type: String,
        required: true
    },
    //the date and time when this event would be held
    dateTime: {
        type: Date,
        required: true
    },
    //any other additional information required
    additionalInfo: {
        type: String
    },
    //the user who created this event
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    //the users who rsvp'd to this event
    rsvps: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);