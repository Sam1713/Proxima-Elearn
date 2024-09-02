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

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Replace with your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true
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
});

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/backend/auth', authRoute);
app.use('/backend/tutor', tutorauthRoute);
app.use('/backend/feed', feedStudentRoute);
app.use('/backend/admin', adminRoute);
app.use('/backend/course', courseRoute);
app.use('/backend/enroll', enrollementRoute);
app.use('/backend/contact', contactRoute);

server.listen(3000, () => {
  console.log('Server is running on port 3000!');
});
