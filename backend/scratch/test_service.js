import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { getCoursesService } from '../services/courseServices.js';

dotenv.config({ path: './backend/.env' });

const testService = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const courses = await getCoursesService();
        console.log(`Service returned ${courses.length} courses`);
        
        courses.forEach(c => {
            console.log(`- ${c.title} by ${c.instructor?.name} (Status: ${c.status}, Approval: ${c.approvalStatus})`);
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

testService();
