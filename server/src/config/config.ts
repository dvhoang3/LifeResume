import dotenv from 'dotenv';

dotenv.config();

export const APP_DEBUG = process.env.APP_DEBUG === 'true';

export const SERVER_PORT = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

const MONGO_USER = process.env.MONGO_USER || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const MONGO_URL = process.env.MONGO_URL || '';
const MONGO_DATABASE = process.env.MONGO_DATABASE || '';
export const MONGO_CONNECTION_STRING = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_URL}/${MONGO_DATABASE}?retryWrites=true&w=majority`;
