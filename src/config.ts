import { configDotenv } from "dotenv";
import { get } from "env-var";

configDotenv()

const DATABASE_URL = get('DATABASE_URL').required().asString();
const PORT = get('PORT').required().asPortNumber();

export { DATABASE_URL, PORT }
