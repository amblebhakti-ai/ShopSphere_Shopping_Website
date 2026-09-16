const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const productRoutes = require("./routes/productRoutes");

const orderRoutes = require("./routes/orderRoutes");

const adminRoutes = require("./routes/adminRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.get("/", (req, res) => {
    res.send("ShopSphere Backend is Running 🚀");
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully ✅");
    })
    .catch((error) => {
        console.log("MongoDB connection failed ❌");
        console.log(error.message);
    });

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`ShopSphere server running on port ${PORT}`);
});