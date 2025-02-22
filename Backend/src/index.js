import dotenv from 'dotenv';
dotenv.config(); // Load environment variables at the very beginning

import express from 'express';
import { app } from './app.js';
import { connectDB } from './db/db.js';

console.log(`Twilio Account SID: ${process.env.TWILIO_ACCOUNT_SID}`);
console.log(`Twilio Auth Token: ${process.env.TWILIO_AUTH_TOKEN ? 'Loaded' : 'Not Loaded'}`);
console.log(`Twilio Phone Number: ${process.env.TWILIO_PHONE_NUMBER}`);

// Verify Cloudinary config
console.log('Environment variables loaded:', {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    hasApiKey: !!process.env.CLOUDINARY_API_KEY,
    hasApiSecret: !!process.env.CLOUDINARY_API_SECRET
});

const port = process.env.PORT || 6000;

connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch(error => {
        console.error('Database connection error:', error);
        process.exit(1);
    });

app.get('/', (req, res) => {
    res.send('Server is ready');
});