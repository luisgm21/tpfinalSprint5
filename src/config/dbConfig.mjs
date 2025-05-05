import mongoose from 'mongoose';

export async function connectDB(){
    try {
        await mongoose.connect('mongodb+srv://Grupo-11:grupo11@cursadanodejs.ls9ii.mongodb.net/Node-js');
        console.log('DB Connected');
    } catch (error) {
        console.log('Error: ', error);
        process.exit(1);
    }
}