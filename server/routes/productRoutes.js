const express = require("express");
const Product = require("../models/Product");

const router = express.Router();


// ================= Get All Products =================

router.get("/", async (req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        });

    }

});


// ================= Add Product =================

router.post("/", async (req, res) => {

    try {

        const product = new Product(req.body);

        const savedProduct = await product.save();

        res.status(201).json(savedProduct);

    } catch (error) {

        res.status(400).json({
            message: "Failed to add product",
            error: error.message
        });

    }

});


// ================= Delete Product =================

router.delete("/:id", async (req, res) => {

    try {

        const product = await Product.findByIdAndDelete(
            req.params.id
        );

        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }

        res.json({
            message: "Product deleted successfully",
            product: product
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to delete product",
            error: error.message
        });

    }

});



// Update product
router.put("/:id", async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        res.json({
            message: "Product updated successfully",
            product: updatedProduct
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to update product",
            error: error.message
        });
    }
});


module.exports = router;