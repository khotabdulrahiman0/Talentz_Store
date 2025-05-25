const express = require("express");
const Cart = require("../models/cart");
const Checkout = require("../models/Checkout");
const Product = require("../models/products");
const User = require("../models/user")
const Order = require("../models/Order");
const { protect , admin } = require("../middleware/authMiddleware");

const router = express.Router();

//get all products
router.get("/",protect,admin,async (req,res) => {
    try {
        const products = await Product.find({});
        res.json(products)
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
})


module.exports = router;