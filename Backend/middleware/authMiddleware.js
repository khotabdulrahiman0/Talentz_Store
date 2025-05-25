const jwt = require("jsonwebtoken");
const User = require("../models/user")

//moiddleware to protect routes

const protect = async (req,res,next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token,process.env.JWT_SECRET);

            req.user = await User.findById(decoded.user.id).select("-password"); //exclude password
            next()
        } catch (error) {
            console.log("Token verification failed:",error)
            res.status(401).json({msg:"Not authorized, token failed"})

        }
    }else{
        res.status(401).json({msg:"Not authorized, no token provided"})
    }
}

//middleware to check admin
const admin = (req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
        res.status(402).json({msg:"You are not admin"})
    }
}

module.exports = {protect, admin};