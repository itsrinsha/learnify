import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const testQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const query = {
            status: 'published',
            approvalStatus: 'approved'
        };
        const results = await Course.find(query);
        console.log(`Results with status/approval only: ${results.length}`);
        
        results.forEach(c => {
            console.log(`- ${c.title}: isHidden=${c.isHidden}`);
        });

        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
testQuery();
