import 'express-async-errors';
import { createApp } from './app';
import { logger } from './utils/logger';
import { PORT, MAILJET_API_KEY, MAILJET_API_SECRET } from './config';
import { type Config, type Driver } from './module/dependency';
import { PrismaClient } from '@prisma/client';
import Mailjet from 'node-mailjet';

const driver: Driver = {
  PrismaClient,
  MailjetClient: Mailjet
};

const config: Config = {
  mailjetApiKey: MAILJET_API_KEY,
  mailjetApiSecret: MAILJET_API_SECRET
};

createApp(driver, config)
  .listen(PORT, () => { logger.info(`Server running on port ${PORT}!`); });
