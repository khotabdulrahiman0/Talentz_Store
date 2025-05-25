const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    color: String
}, { _id: false });

const checkoutSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkoutItems: [checkoutItemSchema],
    shippingAddress: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        postalCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ["COD", "paypal", "razorpay"],
    },
    totalPrice: {
        type: Number,
        required: true
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    paymentStatus: {
        type: String,
        default: "Pending",
    },
    paymentDetails: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    isFinalized: {
        type: Boolean,
        default: false
    },
    finalizedAt: Date,
}, {
    timestamps: true
});

module.exports = mongoose.model("Checkout", checkoutSchema);
