import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import http from 'http';
import { Server } from 'socket.io';

import authRoute from './routes/authRoute';
import tutorauthRoute from './routes/tutorauthRoute';
import feedStudentRoute from './routes/feedStudentRoute';
import adminRoute from './routes/adminRoute';
import courseRoute from './routes/courseRoute';
import enrollementRoute from './routes/enrollementRoute';
import contactRoute from './routes/contactRoute';
import quizRoute from './routes/quizRoute'
import chatRoute from './routes/chatRoute'
dotenv.config();

const mongoUri = process.env.MONGO as string;

if (!mongoUri) {
  throw new Error('MongoDB URI is not defined in the environment variables');
}

mongoose.connect(mongoUri).then(() => {
  console.log('MongoDb connected');
}).catch((err) => {
  console.log(err);
});

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  'http://localhost:5173', 
  'https://proxima-elearn.vercel.app'
];

// Socket.IO CORS configuration
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,  // Allow both localhost and production
    methods: ['GET', 'POST'],
    credentials: true  // Allow credentials (cookies, tokens)
  }
});
io.on('connection', (socket) => {
  console.log('Connection established with ID:', socket.id);
  socket.emit('me', socket.id);


  socket.on('disconnect', () => {
    socket.broadcast.emit('callended');
    console.log('User disconnected');
  });

  socket.on('calluser', ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit('calluser', { signal: signalData, from, name });
  });

  socket.on('answercall', (data) => {
    io.to(data.to).emit('callaccepted', data.signal);
  });

  socket.on('sendMessage', (message) => {
    console.log('Message received:', message);
    io.emit('receiveMessage', message);
  });

});

// Middleware
app.use(cors({
  origin: allowedOrigins,  // Same array of allowed origins
  methods: ['GET', 'POST'],
  credentials: true  // Allow credentials
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/backend/auth', authRoute);
app.use('/backend/tutor/tutorAuth', tutorauthRoute);
app.use('/backend/feed', feedStudentRoute);
app.use('/backend/admin', adminRoute); 
app.use('/backend/course', courseRoute);
app.use('/backend/enroll', enrollementRoute);
app.use('/backend/contact', contactRoute);
app.use('/backend/quiz',quizRoute)
app.use('/backend/chat',chatRoute)

const PORT=process.env.PORT||3001
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
