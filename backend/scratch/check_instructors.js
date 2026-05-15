import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkInstructors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const courses = await Course.find({ title: { $in: ['master react', 'JANGO'] } });
        courses.forEach(c => {
            console.log(`- ${c.title}: instructor=${c.instructor}`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkInstructors();
