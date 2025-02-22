import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

// Debug environment variables
console.log('Cloudinary Config:', {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
});

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
    try {
        if(!file) return null;
        
        console.log('Attempting to upload file:', file);
        
        const response = await cloudinary.uploader.upload(file, { 
            resource_type: "auto",
            folder: "verificationDocs"
        });
        
        console.log('Upload successful:', response.url);
        
        // Clean up temp file
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        
        return response;
    } catch (error) {
        console.error('Upload error:', error);
        // Clean up temp file on error
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
        }
        throw error;
    }
};

export { uploadToCloudinary };