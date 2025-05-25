const express = require('express');
const Cart = require("../models/cart");
const Checkout = require("../models/Checkout");
const Product = require("../models/products");
const Order = require("../models/Order");
const { protect } = require("../middleware/authMiddleware");
const { sendOrderConfirmation } = require("../services/emailService");

// Add Razorpay initialization (you need to add your keys)
const Razorpay = require('razorpay');
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const router = express.Router();

// Checkout route
router.post("/", protect, async (req, res) => {
    const { checkoutItems, shippingAddress, paymentMethod, totalPrice } = req.body;

    if (!checkoutItems || checkoutItems.length === 0) {
        return res.status(400).json({ msg: "No items in checkout" });
    }

    try {
        // Create a checkout session
        const newCheckout = await Checkout.create({
            user: req.user._id,
            checkoutItems: checkoutItems.map(item => ({
                product: item.productId, // Fixed: use productId instead of product
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                color: item.color || "N/A"
            })),
            shippingAddress,
            paymentMethod,
            totalPrice,
            paymentStatus: "Pending",
            isPaid: false,
        });

        console.log(`Checkout created for user: ${req.user._id}`);
        res.status(201).json(newCheckout);
    } catch (error) {
        console.log("Checkout session creating error", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Razorpay order creation
router.post("/:id/razorpay-order", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id);
        if (!checkout) return res.status(404).json({ msg: "Checkout not found" });

        const amount = checkout.totalPrice * 100; // Convert to paise

        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            payment_capture: 1,
        });

        res.json({ orderId: order.id, amount: order.amount });
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Payment route
router.put("/:id/pay", protect, async (req, res) => {
    const { paymentStatus, paymentDetails } = req.body;
    try {
        const checkout = await Checkout.findById(req.params.id);

        if (!checkout) {
            return res.status(404).json({ msg: "No checkout found." });
        }

        if (paymentStatus === "paid") {
            checkout.isPaid = true;
            checkout.paymentStatus = paymentStatus;
            checkout.paymentDetails = paymentDetails;
            checkout.paidAt = Date.now();
            await checkout.save();

            res.status(200).json(checkout); // Changed from 201 to 200
        } else {
            res.status(400).json({ msg: "Invalid payment status." });
        }
    } catch (error) {
        console.log("Payment error", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

// Finalize order route
router.post("/:id/finalize", protect, async (req, res) => {
    try {
        const checkout = await Checkout.findById(req.params.id).populate("user", "name email");

        if (!checkout) {
            return res.status(404).json({ msg: "Checkout not found" });
        }

        if (checkout.isPaid && !checkout.isFinalized) {
            // Prepare final order items
            const finalOrderItems = checkout.checkoutItems.map(item => ({
                product: item.product, // Fixed: use correct field name
                name: item.name,
                image: item.image,
                price: item.price,
                quantity: item.quantity,
                color: item.color || "N/A"
            }));

            // Create a final order
            const finalOrder = await Order.create({
                user: checkout.user._id,
                orderItems: finalOrderItems,
                shippingAddress: checkout.shippingAddress,
                paymentMethod: checkout.paymentMethod,
                totalPrice: checkout.totalPrice,
                isPaid: true,
                paidAt: checkout.paidAt,
                isDelivered: false,
                paymentStatus: "paid",
                paymentDetails: checkout.paymentDetails
            });

            // Mark the checkout as finalized
            checkout.isFinalized = true;
            checkout.finalizedAt = Date.now();
            await checkout.save();

            // Delete the user's cart to clean up
            await Cart.findOneAndDelete({ user: checkout.user._id });

            // Send order confirmation emails
            try {
                await sendOrderConfirmation(checkout.user, finalOrder);
            } catch (emailError) {
                console.log("Email sending failed:", emailError);
                // Don't fail the entire request if email fails
            }

            res.status(201).json(finalOrder);
        } else if (checkout.isFinalized) {
            res.status(400).json({ msg: "Checkout already finalized" });
        } else {
            res.status(400).json({ msg: "Checkout is not paid" });
        }
    } catch (error) {
        console.log("Finalize order error", error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
});

module.exports = router;