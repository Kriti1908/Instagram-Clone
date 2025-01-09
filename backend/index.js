import express, { urlencoded } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import messageRoutes from './routes/message.routes.js';
import { app, server } from './socket/socket.js';
dotenv.config({});

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    return res.status(200).json(
        {
            message: 'Hello World!'
        }
    );
});

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended: true}));
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/message', messageRoutes);

server.listen(PORT,()=> {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
})