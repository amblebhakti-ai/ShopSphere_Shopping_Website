const express = require("express");
const Order = require("../models/Order");
const Product = require("../models/Product");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// PLACE NEW ORDER
// ===============================

router.post("/", authMiddleware, async (req, res) => {

    try {

        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required"
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        const order = new Order({

            userId: req.user.userId,

            productId: product._id,

            productName: product.name,

            image: product.image,

            price: product.price,

            quantity: quantity || 1,

            status: "Ordered"

        });

        const savedOrder = await order.save();

        res.status(201).json({

            message: "Order placed successfully",

            order: savedOrder

        });

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to place order",

            error: error.message

        });

    }

});


// ===============================
// GET MY ORDERS
// ===============================

router.get("/my-orders", authMiddleware, async (req, res) => {

    try {

        const orders = await Order.find({
            userId: req.user.userId
        }).sort({
            createdAt: -1
        });

        res.json(orders);

    } catch (error) {

        console.log(error);

        res.status(500).json({

            message: "Failed to fetch orders",

            error: error.message

        });

    }

});


// GET ALL ORDERS - ADMIN
router.get("/all", async (req, res) => {
    try {
        const orders = await Order.find()
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to fetch all orders",
            error: error.message
        });
    }
});


// ================= UPDATE ORDER STATUS =================

router.put("/:id", async (req, res) => {

    try {

        const updatedOrder =
            await Order.findByIdAndUpdate(
                req.params.id,
                {
                    status: req.body.status
                },
                {
                    new: true
                }
            );

        if (!updatedOrder) {

            return res.status(404).json({
                message: "Order not found"
            });

        }

        res.json({
            message: "Order status updated successfully",
            order: updatedOrder
        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update order",
            error: error.message
        });

    }

});


module.exports = router;