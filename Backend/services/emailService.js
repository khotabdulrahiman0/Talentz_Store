const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Sends an OTP to the user's email for either verification or password reset.
 * @param {string} email - The recipient's email address.
 * @param {string} otp - The generated OTP code.
 * @param {string} purpose - The purpose of the OTP ("verification" or "reset").
 */
async function sendOTP(email, otp, purpose = "verification") {
    const subject =
        purpose === "reset"
            ? "Reset Your Password - OTP Verification"
            : "Verify Your Account - OTP Code";

    const message =
        purpose === "reset"
            ? `Use the following OTP to reset your password:`
            : `Your One-Time Password (OTP) for account verification is:`;

    try {
        await transporter.sendMail({
            from: `"Armk" <${process.env.EMAIL}>`,
            to: email,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333;">${subject}</h2>
                    <p style="font-size: 16px; color: #555;">${message}</p>
                    <h3 style="color: #008000; font-size: 24px; text-align: center;">${otp}</h3>
                    <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
                    <hr style="border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 14px; color: #777;">Thank you!<br> <strong>Your App Team</strong></p>
                </div>
            `,
        });
        console.log(`OTP sent for ${purpose} to ${email}`);
    } catch (error) {
        console.error(`Error sending OTP for ${purpose} to ${email}:`, error);
        throw new Error(`Error sending OTP for ${purpose}`);
    }
}

// Generic function to send emails
async function sendEmail(to, subject, message) {
    try {
        let info = await transporter.sendMail({
            from: `"Your Store" <${process.env.EMAIL}>`,
            to,
            subject,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #333;">Hello,</h2>
                    <p style="font-size: 16px; color: #555;">${message}</p>
                    <hr style="border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 14px; color: #777;">Thank you for shopping with us!<br> <strong>Your Store Team</strong></p>
                </div>
            `,
        });
        console.log(`Email sent to ${to}:`, info.response);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error("Email sending failed");
    }
}


// Function to send order confirmation emails
async function sendOrderConfirmation(user, order) {
    const adminEmail = process.env.ADMIN_EMAIL; // Ensure this is set in your .env file

    const orderDetailsHtml = order.orderItems.map(item => `
        <p><strong>${item.name}</strong> - ${item.quantity} x ₹${item.price} (${item.size}, ${item.color})</p>
    `).join("");

    // Email for the user
    const userMessage = `
        <p>Dear ${user.name},</p>
        <p>Thank you for your order! Your order has been successfully placed.</p>
        <p><strong>Order Details:</strong></p>
        ${orderDetailsHtml}
        <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
    `;

    // Email for the admin
    const adminMessage = `
        <p>Hello Admin,</p>
        <p>A new order has been placed by ${user.name}.</p>
        <p><strong>Order Details:</strong></p>
        ${orderDetailsHtml}
        <p><strong>Total Price:</strong> ₹${order.totalPrice}</p>
        <p><strong>Shipping Address:</strong> ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}</p>
    `;

    try {
        // Send email to the user
        await sendEmail(user.email, "Order Placed Successfully", userMessage);

        // Send email to the admin
        await sendEmail(adminEmail, "New Order Received", adminMessage);
    } catch (error) {
        console.error("Error sending order confirmation emails:", error);
    }
}

// // Send OTP email with a better design
// async function sendOTP(email, otp) {
//     try {
//         let info = await transporter.sendMail({
//             from: `"Your App" <${process.env.EMAIL}>`,
//             to: email,
//             subject: "Your OTP Code for Verification",
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
//                     <h2 style="color: #333;">Email Verification</h2>
//                     <p style="font-size: 16px; color: #555;">Your One-Time Password (OTP) for verification is:</p>
//                     <h3 style="color: #008000; font-size: 24px; text-align: center;">${otp}</h3>
//                     <p style="font-size: 14px; color: #777;">This OTP is valid for 10 minutes. Please do not share it with anyone.</p>
//                     <hr style="border: none; border-top: 1px solid #ddd;">
//                     <p style="font-size: 14px; color: #777;">Thank you for registering!<br> <strong>Your App Team</strong></p>
//                 </div>
//             `,
//         });
//         console.log("OTP sent:", info.response);
//     } catch (error) {
//         console.error("Error sending OTP:", error);
//         throw new Error("Error sending OTP");
//     }
// }

module.exports = { sendOTP, sendEmail , sendOrderConfirmation };
