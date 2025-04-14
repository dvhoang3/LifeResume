import express from 'express';
import mongoose from 'mongoose';
import { MONGO_CONNECTION_STRING } from "../config/config";
import errorHandler from './middleware/error-handler';
import usersRouter from './routes/users';

const app = express();

mongoose.connect(MONGO_CONNECTION_STRING);
const db = mongoose.connection;
db.on('connected', () => console.log('Successfully connected to Mongo.'));
db.on('error', (error) => console.error(error));

app.use(express.json());

app.use('/users', usersRouter);

app.use(errorHandler);

export default app;