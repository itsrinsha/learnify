import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './backend/.env' });

const checkRaw = async () => {
    try {
        const db = await mongoose.connect(process.env.MONGO_URL);
        const collection = db.connection.collection('courses');
        const docs = await collection.find({ title: { $in: ['master react', 'JANGO'] } }).toArray();
        docs.forEach(d => {
            console.log(`- ${d.title}:`);
            console.log(`  has isHidden: ${'isHidden' in d}`);
            console.log(`  isHidden value: ${d.isHidden}`);
        });
        await mongoose.connection.close();
    } catch (error) { console.error(error); }
};
checkRaw();
