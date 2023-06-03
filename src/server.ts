import 'express-async-errors';
import { app } from "./app";
import { logger } from './utils/logger';
import { PORT } from './config';

app.listen(PORT, () => logger.info(`Server running on port ${PORT}!`));
