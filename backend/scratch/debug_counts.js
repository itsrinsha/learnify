import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';
import User from '../models/User.js';

dotenv.config({ path: './backend/.env' });

const debugCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        const all = await Course.find({});
        console.log(`Total: ${all.length}`);

        const published = await Course.find({ status: 'published' });
        console.log(`Published: ${published.length}`);

        const approved = await Course.find({ approvalStatus: 'approved' });
        console.log(`Approved: ${approved.length}`);

        const filtered = await Course.find({
            status: 'published',
            approvalStatus: 'approved',
            isHidden: false
        });
        console.log(`Filtered (Published + Approved + Not Hidden): ${filtered.length}`);
        
        filtered.forEach(c => console.log(`- ${c.title}`));

        await mongoose.connection.close();
    } catch (error) {
        console.error('Error:', error);
    }
};

debugCourses();
