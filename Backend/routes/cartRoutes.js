const express = require('express');
const Cart = require("../models/cart");
const Product = require("../models/products");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Helper function to get cart
const getCart = async (userId, guestId) => {
    if (userId) {
        return await Cart.findOne({ user: userId });
    } else if (guestId) {
        return await Cart.findOne({ guestId });
    }
    return null;
};

// Add to Cart
router.post("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ msg: "Product not found" });

        let cart = await getCart(userId, guestId);

        if (cart) {
            const productIndex = cart.products.findIndex(
                (p) => p.product.toString() === productId && p.size === size && p.color === color
            );

            if (productIndex > -1) {
                cart.products[productIndex].quantity += quantity;
            } else {
                cart.products.push({
                    product: productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: parseFloat(product.price),
                    size,
                    color,
                    quantity,
                });
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + (parseFloat(item.price) * item.quantity),
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            const newCart = await Cart.create({
                user: userId || undefined,
                guestId: guestId || "guest_" + new Date().getTime(),
                products: [{
                    product: productId,
                    name: product.name,
                    image: product.images?.[0]?.url || "",
                    price: parseFloat(product.price),
                    size,
                    color,
                    quantity,
                }],
                totalPrice: parseFloat(product.price) * quantity,
            });

            return res.status(201).json(newCart);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Update quantity in cart
router.put("/", async (req, res) => {
    const { productId, quantity, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId && p.size === size && p.color === color
        );

        if (productIndex > -1) {
            if (quantity > 0) {
                cart.products[productIndex].quantity = quantity;
            } else {
                cart.products.splice(productIndex, 1);
            }

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );
            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ msg: "Product not found in cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Delete item from cart
router.delete("/", async (req, res) => {
    const { productId, size, color, guestId, userId } = req.body;
    try {
        let cart = await getCart(userId, guestId);
        if (!cart) return res.status(404).json({ msg: "Cart not found" });

        const productIndex = cart.products.findIndex(
            (p) => p.product.toString() === productId && p.size === size && p.color === color
        );

        if (productIndex > -1) {
            cart.products.splice(productIndex, 1);

            cart.totalPrice = cart.products.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
            );

            await cart.save();
            return res.status(200).json(cart);
        } else {
            return res.status(404).json({ msg: "Product not found in the cart" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Get cart
router.get("/", async (req, res) => {
    const { guestId, userId } = req.query;
    try {
        let cart = await getCart(userId, guestId);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ msg: "Cart not found." });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

// Merge guest cart with user cart after login
router.post("/merge", protect, async (req, res) => {
    const { guestId } = req.query;
    const userId = req.user._id;

    try {
        const guestCart = await Cart.findOne({ guestId });
        const userCart = await Cart.findOne({ user: userId });

        if (guestCart) {
            if (guestCart.products.length === 0) {
                return res.status(400).json({ msg: "Guest cart is empty" });
            }

            if (userCart) {
                guestCart.products.forEach((guestItem) => {
                    const productIndex = userCart.products.findIndex(
                        (item) =>
                            item.product.toString() === guestItem.product.toString() &&
                            item.size === guestItem.size &&
                            item.color === guestItem.color
                    );

                    if (productIndex > -1) {
                        userCart.products[productIndex].quantity += guestItem.quantity;
                    } else {
                        userCart.products.push(guestItem);
                    }
                });

                userCart.totalPrice = userCart.products.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0
                );

                await userCart.save();
                await Cart.findOneAndDelete({ guestId });

                res.status(200).json(userCart);
            } else {
                guestCart.user = userId;
                guestCart.guestId = undefined;
                await guestCart.save();
                res.status(200).json(guestCart);
            }
        } else {
            if (userCart) {
                return res.status(200).json(userCart);
            }
            res.status(404).json({ msg: "Guest cart not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

module.exports = router;
