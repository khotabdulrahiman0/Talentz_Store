const express = require("express");
const Cart = require("../models/cart");
const Checkout = require("../models/Checkout");
const Product = require("../models/products");
const User = require("../models/user")
const Order = require("../models/Order");
const { protect , admin } = require("../middleware/authMiddleware");

const router = express.Router();

// get all users 
router.get("/",protect,admin,async (req,res) => {
  try {
        const users = await User.find({});
        res.json(users)
  } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
  }   
})

// add a new user
router.post("/",protect,admin,async (req,res) => {
    const {name,email,password,role} = req.body;
    
    try {
        let user = await User.findOne({email});
        if(user){
            return res.status(400).json({msg:"User already exists"})
        }

        user = new User({
            name,
            email,
            password,
            role: role || customer,
        })
        await user.save();
        res.status(201).json({msg:"user created successfullly.",user})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
})

// update user info 
router.put("/:id",protect,admin,async (req,res) => {
    try {
        const user = await User.findById(req.params.id)
        if(user){
            user.name = req.body.name || user.name,
            user.email = req.body.email || user.email,
            user.role = req.body.role || user.role

            const updatedUser = await user.save();
        res.json({msg:"user updated successfully",user:updatedUser})
        }else {
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
})


// delte a user
router.delete("/:id",protect,admin,async (req,res) => {
    try {
        const user = await User.findById(req.params.id);
        if(user){
            await user.deleteOne();
            res.json({msg:"user deleted successfully"});
        }else{
            res.status(404).json({ msg: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
})

module.exports = router;