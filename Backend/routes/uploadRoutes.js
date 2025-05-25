const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

require("dotenv").config();
const router = express.Router()

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

// multer setup
const storage = multer.memoryStorage();
const upload = multer({storage});


router.post("/",upload.single("image"),async (req,res) => {
    try {
        if(!req.file){
            return res.status(400).json({msg:"No file Uploaded"});
        }

        // function to handle the stream upload to cloudinary
        const streamUpload=(fileBuffer)=>{
            return new Promise((reslove, reject) =>{
                const stream = cloudinary.uploader.upload_stream((error,result)=>{
                    if(result){
                        reslove(result);
                    }else{
                        reject(error)
                    }
                });
                // use streamfier to convert file buffer to straeam   
                streamifier.createReadStream(fileBuffer).pipe(stream);
            });
        };
        // call the streamupload function
        const result = await streamUpload(req.file.buffer);

        // Respond with the uploaded image url
        res.json({imageUrl: result.secure_url});

    } catch (error) {
        console.log(error);
        res.status(500).json({msg:"Server Error"});
    }
})

module.exports = router;