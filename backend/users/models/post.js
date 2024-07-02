const mongoose = require('mongoose');
const { Schema } = mongoose;

const postSchema = new Schema({
    commodity: {
        type: Schema.Types.ObjectId,
        ref: 'Commodity',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }],
    likes: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [String],
        default: [],
    },

    lastDisplayedAt: {
        type: Date,
        default: Date.now,
    },
});

// Middleware to handle `updatedAt` on save and update
postSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Post', postSchema);
