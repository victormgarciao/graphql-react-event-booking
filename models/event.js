const USER_MODEL = process.env.USER_MODEL;

const mongose = require('mongoose');

const Schema = mongose.Schema;

const eventSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongose.model('Event', eventSchema);