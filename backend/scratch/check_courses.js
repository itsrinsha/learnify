import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';

dotenv.config({ path: './backend/.env' });

const checkCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const courses = await Course.find({}).populate('instructor', 'name email role');
        console.log(`Total Courses in DB: ${courses.length}`);
        
        courses.forEach(c => {
            console.log(`- Title: ${c.title}`);
            console.log(`  Instructor: ${c.instructor?.name} (${c.instructor?.email})`);
            console.log(`  Status: ${c.status}`);
            console.log(`  Approval: ${c.approvalStatus}`);
            console.log(`  IsHidden: ${c.isHidden}`);
            console.log('-------------------');
        });

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

checkCourses();
