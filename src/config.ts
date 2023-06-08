import { configDotenv } from 'dotenv';
import { get } from 'env-var';

configDotenv();

export const DATABASE_URL = get('DATABASE_URL').required().asString();
export const PORT = get('PORT').required().asPortNumber();
export const JWT_SECRET = get('JWT_SECRET').required().asString();
export const SENDGRID_API_KEY = get('SENDGRID_API_KEY').required().asString();
export const BASE_URL = get('BASE_URL').required().asString();
export const CONFIRMATION_EMAIL_SENDER_ADDRESS = get('CONFIRMATION_EMAIL_SENDER_ADDRESS').required().asString();
export const CONFIRMATION_EMAIL_EXPIRY = get('CONFIRMATION_EMAIL_EXPIRY').required().asString();
