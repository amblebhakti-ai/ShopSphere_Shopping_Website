const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function createAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected ✅");

        const existingAdmin = await Admin.findOne({
            email: "admin@shopsphere.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists ✅");
            process.exit();
        }

        const hashedPassword = await bcrypt.hash(
            "Admin@123",
            10
        );

        const admin = new Admin({
            name: "ShopSphere Admin",
            email: "admin@shopsphere.com",
            password: hashedPassword
        });

        await admin.save();

        console.log("Admin created successfully ✅");
        console.log("Email: admin@shopsphere.com");
        console.log("Password: Admin@123");

        process.exit();

    } catch (error) {
        console.log("Error ❌");
        console.log(error.message);
        process.exit(1);
    }
}

createAdmin();