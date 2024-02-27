import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()


mongoose.connect(`mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}.mongodb.net/?retryWrites=true&w=majority`, 
{useNewUrlParser: true, useUnifiedTopology: true})


// mongoose.connect('mongodb://127.0.0.1:27017/blog')