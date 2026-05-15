import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config({ path: './backend/.env' });

const checkHidden = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        const all = await Course.find({});
        all.forEach(c => {
            if (c.isHidden !== false) {
                console.log(`- ${c.title}: isHidden=${c.isHidden} (type: ${typeof c.isHidden})`);
            }
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkHidden();
