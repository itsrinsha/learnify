import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkFeatured = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const courses = await Course.find({ status: 'published', approvalStatus: 'approved' });
        courses.forEach(c => {
            console.log(`- ${c.title}: featured=${c.featured}`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkFeatured();
