const express = require('express');
const Subscriber = require("../models/Subscriber") 

const router = express.Router();

//handle newsletter subscription
router.post("/subscribe",async (req,res) => {
    const {email} = req.body;

    if(!email){
        return res.status(400).json({msg:"Email is required"})
    }
    try {
        // check if email is already exists
        let subscriber = await Subscriber.findOne({email});

        if(subscriber){
            return res.status(400).json({msg:"email is already a subscriber"})
        }

        // create a new subscriber
        subscriber = new Subscriber({email});
        await subscriber.save();

        res.status(201).json({msg:"Successfully subscribed to the newsletter."})
    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Internal Server Error."})
    }
})

module.exports = router;