const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { protect } = require("../middleware/authMiddleware");
const { sendOTP, sendEmail } = require("../services/emailService");
const router = express.Router();

// Step 1: Request OTP for registration
router.post("/register/request-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    try {
        // Check if user already exists and is verified
        const existingUser = await User.findOne({ email, isVerified: true });
        if (existingUser) {
            return res.status(400).json({ msg: "User with this email already exists" });
        }

        // Find or create an unverified user
        let user = await User.findOne({ email, isVerified: false });
        
        if (!user) {
            // Create a new unverified user with temporary required fields
            user = new User({
                email,
                name: "Temporary", // Will be updated during verification
                password: "temporary123456", // Will be replaced during verification
                isVerified: false
            });
        }
        
        // Generate and save OTP
        const otp = user.generateOTP();
        await user.save();

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ msg: "OTP sent to your email", email });

    } catch (error) {
        console.error("OTP Request Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Step 2: Verify OTP and complete registration
router.post("/register/verify", async (req, res) => {
    const { email, otp, name, password } = req.body;

    if (!email || !otp || !name || !password) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        // Find user by email
        const user = await User.findOne({ email, isVerified: false });

        if (!user) {
            return res.status(400).json({ msg: "User not found or already verified" });
        }

        // Verify OTP
        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        // Update user details
        user.name = name;
        user.password = password; // Will be hashed by pre-save middleware
        user.isVerified = true;
        user.otp = undefined; // Clear OTP
        user.otpExpiry = undefined; // Clear OTP expiry

        await user.save();

        // Create JWT payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
            if (err) throw err;

            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                },
                token,
            });
        });

    } catch (error) {
        console.error("OTP Verification Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Resend OTP
router.post("/register/resend-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    try {
        // Check if user exists and is not verified
        const user = await User.findOne({ email, isVerified: false });
        
        if (!user) {
            return res.status(404).json({ msg: "User not found or already verified" });
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save();

        // Send new OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ msg: "New OTP sent to your email", email });

    } catch (error) {
        console.error("Resend OTP Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        
        // Check if user is verified
        if (!user.isVerified) {
            return res.status(401).json({ 
                msg: "Email not verified", 
                needVerification: true,
                email: user.email 
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

        // Create jwt payload
        const payload = { user: { id: user._id, role: user.role } };

        // Sign and return the token along with user data
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "48h" }, (err, token) => {
            if (err) throw err;

            res.json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                },
                token,
            });
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

router.post("/forgot-password/request-otp", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ msg: "Email is required" });
    }

    try {
        const user = await User.findOne({ email, isVerified: true });

        if (!user) {
            return res.status(404).json({ msg: "User not found or not verified" });
        }

        // Generate OTP for password reset
        const otp = user.generateOTP();
        await user.save();

        // Send OTP via email
        await sendOTP(email, otp);

        res.status(200).json({ msg: "OTP sent to your email", email });
    } catch (error) {
        console.error("Forgot Password OTP Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Forgot Password - Verify OTP & Reset Password
router.post("/forgot-password/reset", async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ msg: "All fields are required" });
    }

    try {
        const user = await User.findOne({ email, isVerified: true });

        if (!user) {
            return res.status(404).json({ msg: "User not found or not verified" });
        }

        // Verify OTP
        if (!user.verifyOTP(otp)) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        // Update password and clear OTP
        user.password = newPassword; // Will be hashed by pre-save middleware
        user.otp = undefined;
        user.otpExpiry = undefined;

        await user.save();

        res.status(200).json({ msg: "Password reset successful. You can now log in." });
    } catch (error) {
        console.error("Password Reset Error:", error);
        res.status(500).json({ msg: "Server Error", error: error.message });
    }
});

// Profile route
router.get("/profile", protect, async (req, res) => {
    res.json(req.user);
});

module.exports = router;