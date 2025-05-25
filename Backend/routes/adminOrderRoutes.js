const express = require("express");
const Order = require("../models/Order");
const { protect, admin } = require("../middleware/authMiddleware");
const { sendEmail } = require("../services/emailService"); // Reusing email service

const router = express.Router();

// Get all orders (Admin only)
router.get("/", protect, admin, async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email");
        res.json(orders);
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

// Update order status and send email
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user", "email");

        if (!order) {
            return res.status(404).json({ msg: "No order found." });
        }

        // Update order status
        if (req.body.status) {
            order.status = req.body.status;
            if (req.body.status === "Delivered") {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
            }
        }

        const updatedOrder = await order.save();

        // Send email notification using emailService.js
        const emailSubject = `Order Update - Your Order #${order._id}`;
        const emailMessage = `Your order with ID: ${order._id} has been updated to status: ${order.status}.`;
        await sendEmail(order.user.email, emailSubject, emailMessage);

        res.json(updatedOrder);
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

// Delete an order (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            await order.deleteOne();
            res.json({ msg: "Order deleted" });
        } else {
            res.status(404).json({ msg: "Order not found" });
        }
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

module.exports = router;
