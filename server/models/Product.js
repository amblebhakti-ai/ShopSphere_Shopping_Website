const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        category: {
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

        mrp: {
            type: Number,
            required: true
        },

        discount: {
            type: String
        },

        rating: {
            type: Number,
            default: 0
        },

        description: {
            type: String,
            default: ""
        },

        stock: {
            type: Number,
            default: 10
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Product", productSchema);
