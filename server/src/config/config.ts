import dotenv from 'dotenv';

dotenv.config();

const PRODUCTION_ENV = process.env.NODE_ENV === 'production';

const APP_DEBUG = process.env.APP_DEBUG === 'true';

const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = process.env.MONGO_URL || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`;

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || '';

export default {
  PRODUCTION_ENV,
  APP_DEBUG,
  SERVER_PORT,
  MONGO_CONNECTION_STRING,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
