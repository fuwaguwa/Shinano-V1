import { config } from 'dotenv'
import { Shinano } from "./structures/Client";
import mongoose from 'mongoose'
config();

const client = new Shinano();


// Establishing Connections
mongoose.connect(process.env.mongoDB).then(() => {
    console.log('Connected to database!')
}).catch((err) => {
    console.log(err)
})

client.start();


export {client}