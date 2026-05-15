import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkTypes = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const courses = await Course.find({ title: { $in: ['master react', 'JANGO'] } });
        courses.forEach(c => {
            console.log(`- ${c.title}:`);
            console.log(`  status: ${typeof c.status} (${c.status})`);
            console.log(`  approvalStatus: ${typeof c.approvalStatus} (${c.approvalStatus})`);
            console.log(`  isHidden: ${typeof c.isHidden} (${c.isHidden})`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkTypes();
