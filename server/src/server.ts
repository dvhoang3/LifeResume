import config from "./config/config";
import app from './app/index'
import mongoose from 'mongoose';

const db = mongoose.connection;
db.on('connected', () => console.log('Successfully connected to MongoDB.'));
db.on('error', (error) => console.error(error));


mongoose.connect(config.MONGO_CONNECTION_STRING)
  .then(_ => app.listen(config.SERVER_PORT,
    () => console.log(`Successfully started server on port ${config.SERVER_PORT}`)
  ))
  .catch((err) => console.error(err));
