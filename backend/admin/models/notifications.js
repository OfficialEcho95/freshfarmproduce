const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    users: [{
        type: Schema.Types.ObjectId,
        ref: 'Admin'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
