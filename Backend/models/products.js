const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true
    },
    discountPrice: {
        type: Number,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
    sku: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true, // e.g., 'Necklace', 'Bracelet', 'Purse'
    },
    colors: {
        type: [String],
        required: true,
    },
    images: [{
        url: String
    }],
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0
    },
    tags: [String], // e.g., 'gift', 'festival', 'ethnic'
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    metaTitle: String,
    metaDescription: String,
    metaKeywords: String,
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    weight: Number, // important for shipping handmade items
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
