const mongoose = require('mongoose');
const { Schema } = mongoose;

const CommoditySchema = new Schema({
    farmer: {
        type: Schema.Types.ObjectId,
        ref: 'User',
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
    quantityAvailable: {
        type: Number,
        required: true,
        min: 1,
    },
    images: {
        type: [String],
        default: [],
    },
    categories: {
        type: [String],
        enum: ['fruits', 'vegetables', 'spice', 'others'],
        default: 'others',
        validate: {
            validator: function(categories) {
                return categories.every(category => typeof category === 'string' && category.trim() !== '');
            },
            message: 'Categories must be non-empty strings.',
        },
    },
    location: {
        type: String,
        required: true,
        trim: true,
    },
    postDate: {
        type: Date,
        default: Date.now,
    },
    lastUpdated: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'sold'],
        default: 'active',
    },
});

CommoditySchema.pre('save', function (next) {
    this.lastUpdated = Date.now();
    next();
});

module.exports = mongoose.model('Commodity', CommoditySchema);
