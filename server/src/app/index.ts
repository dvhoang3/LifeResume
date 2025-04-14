import express from 'express';
import errorHandler from './middleware/error-handler';
import usersRouter from './routes/users';
import cookieParser from 'cookie-parser';

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/users', usersRouter);

app.use(errorHandler);

export default app;