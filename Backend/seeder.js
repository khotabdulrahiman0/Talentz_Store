const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/products");
const User = require("./models/user");
const products = require('./data/products')
const Cart = require("./models/cart");

dotenv.config();

// mongo conn.
mongoose.connect(process.env.MONGO_URI);

//function to seed data
const seedData = async () => {
    try {
        //clear existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //create a admin user
        const createdUser = await User.create({
            name:"Admin user",
            email:"admin@example.com",
            password:"qwertyui",
            role:"admin",
        });

        // assign a default id to the product
        const userID = createdUser._id;

        const sampleProducts = products.map((product)=>{
            return {...product, user:userID};
        })

        // insert product into db
        await Product.insertMany(sampleProducts);
        console.log("product data seeded successfully");
        process.exit();

    } catch (error) {
        console.log("Error seeding the data",error);
        process.exit(1)
    }
};
seedData()