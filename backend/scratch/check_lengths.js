import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkLengths = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const courses = await Course.find({ title: { $in: ['master react', 'JANGO'] } });
        courses.forEach(c => {
            console.log(`- ${c.title}:`);
            console.log(`  status length: ${c.status.length}`);
            console.log(`  approvalStatus length: ${c.approvalStatus.length}`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkLengths();
