const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");
const products = require("./data/products");

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB connected ✅");

        await Product.deleteMany({});
        await Product.insertMany(products);

        console.log("Products added successfully ✅");

        mongoose.connection.close();
    })
    .catch((error) => {
        console.log("Error ❌");
        console.log(error.message);
    });