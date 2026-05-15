import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkPublished = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const courses = await Course.find({ status: 'published' });
        courses.forEach(c => {
            console.log(`- ${c.title}: status=${c.status}, approvalStatus=${c.approvalStatus}, isHidden=${c.isHidden}`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkPublished();
