const express = require("express")
const Cart = require("../models/cart");
const Checkout = require("../models/Checkout");
const Product = require("../models/products");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");


const router = express.Router();

// get orders
router.get("/my-orders",protect,async (req,res) => {
    try {
        const orders = await Order.find({user: req.user._id}).sort({createdAt: -1}) //sort my most rescent
        res.json(orders);
    } catch (error) {
        console.log("checkout session creating err",error)
        res.status(500).json({msg:"Server error"})
    }
});

// get order details by id
router.get("/:id",protect,async (req,res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user","name email");

        if(!order){
           return res.status(404).json({msg:"Order not found."});
        }
        res.json(order);
    } catch (error) {
        console.log("checkout session creating err",error)
        res.status(500).json({msg:"Server error"})
    }
});

module.exports = router;