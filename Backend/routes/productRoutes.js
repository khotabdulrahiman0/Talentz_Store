const express = require("express");
const Product = require("../models/products");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

//create products
router.post("/", protect, admin, async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            colors,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
        } = req.body;

        const product = new Product({
            name,
            description,
            price,
            discountPrice,
            countInStock,
            category,
            colors,
            images,
            isFeatured,
            isPublished,
            tags,
            dimensions,
            weight,
            sku,
            user: req.user._id,
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Server Error" });
    }
});

//update products
router.put("/:id", protect, admin, async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (product) {
            // Update product fields
            const {
                name,
                description,
                price,
                discountPrice,
                countInStock,
                category,
                colors,
                gender,
                images,
                isFeatured,
                isPublished,
                tags,
                dimensions,
                weight,
                sku,
            } = req.body;

            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.discountPrice = discountPrice || product.discountPrice;
            product.countInStock = countInStock || product.countInStock;
            product.category = category || product.category;
            product.colors = colors || product.colors;
            product.gender = gender || product.gender;
            product.images = images || product.images;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
            product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
            product.tags = tags || product.tags;
            product.dimensions = dimensions || product.dimensions;
            product.weight = weight || product.weight;
            product.sku = sku || product.sku;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ msg: "Product not found" });
        }
    } catch (error) {
        console.log("Update error:", error);
        res.status(500).json({ msg: "Server error" });
    }
});

// deleting product
router.delete("/:id", protect, admin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            await product.deleteOne();
            res.json({ msg: "Product deleted" });
        } else {
            res.status(404).json({ msg: "Product not found." });
        }
    } catch (error) {
        console.log("error on del rou", error);
    }
});

// get products
router.get("/", async (req, res) => {
    try {
        const { color, minPrice, maxPrice, sortBy, search, category, limit } = req.query;
        let query = {};

        // filter logic
        
        if (category && category.toLocaleLowerCase() !== "all") {
            query.category = category;
        }
        if (color) {
            query.colors = { $in: [color] };
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price["$gte"] = Number(minPrice);
            if (maxPrice) query.price["$lte"] = Number(maxPrice);
        }
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // sort logic
        let sort = {};
        if (sortBy) {
            switch (sortBy) {
                case "priceAsc": sort = { price: 1 };
                    break;
                case "priceDesc": sort = { price: -1 };
                    break;
                case "popularity": sort = { rating: 1 };
                    break;
                default:
                    break;
            }
        }

        // fetch product from db and apply sorting and limit
        let products = await Product.find(query).sort(sort).limit(Number(limit) || 0);
        res.json(products);

    } catch (error) {
        console.log("err on get product", error);
        res.status(500).json({ msg: "Server error" });
    }
});

//best seller route
router.get("/best-seller", async (req, res) => {
    try {
        const bestSeller = await Product.findOne().sort({ rating: -1 });
        if (bestSeller) {
            res.json(bestSeller);
        } else {
            res.status(404).json({ msg: "No bestseller products" });
        }
    } catch (error) {
        console.log("error on similar products", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

//new arrivals
router.get("/new-arrivals", async (req, res) => {
    try {
        const newArrival = await Product.find().sort({ createdAt: -1 }).limit(8);
        if (newArrival) {
            res.json(newArrival);
        } else {
            res.status(404).json({ msg: "No products" });
        }
    } catch (error) {
        console.log("error on similar products", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

//to get single product
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ msg: "No product found" });
        }
    } catch (error) {
        console.log("Error on sin prod get", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

router.get("/similar/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ msg: "Product not found" });
        }

        const similarProduct = await Product.find({
            _id: { $ne: id }, //exclude the current id 
            category: product.category,
        }).limit(4);

        res.json(similarProduct);
    } catch (error) {
        console.log("error on similar products", error);
        res.status(500).json({ msg: "Internal Server Error." });
    }
});

module.exports = router;