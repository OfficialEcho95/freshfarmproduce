const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
            validator: function(v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: props => `${props.value} is not a valid email address!`,
        },
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['farmer', 'buyer', 'admin', 'superadmin'],
        default: 'buyer',
    },
    lastLogin: {
        type: Date,
        default: null,
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    farmName: {
        type: String,
        function () {
            return this.role === 'farmer';
        },
        trim: true,
    },
    farmLocation: {
        type: String,
        function () {
            return this.role === 'farmer';
        },
        trim: true,
    },
    deliveryAddress: {
        type: String,
        function () {
            return this.role === 'buyer' || 'farmer';
        },
        trim: true,
    },
    posts: [{
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }],
    shippingAddress: {
        type: String,
        function () {
            return this.role === 'buyer' || "farmer";
        },
        trim: true,
    },
    completedSales: {
        type: Number,
        default: 0,
    },
    commodities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Commodity',
    }],
});

// Middleware to handle updatedAt on save and update
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);
