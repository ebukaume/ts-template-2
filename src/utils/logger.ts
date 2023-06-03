import pino, { Logger as PinoLogger, LoggerOptions, DestinationStream } from "pino";

class Logger {
  private static instance: Logger;

  private constructor(private client: PinoLogger<LoggerOptions | DestinationStream>) { }

  static build(client: PinoLogger<LoggerOptions | DestinationStream>): Logger {
    if (!this.instance) {
      this.instance = new Logger(client);
    }

    return this.instance;
  }

  error(msg: Error): void {
    this.client.error(msg)
  }

  info(msg: string): void {
    this.client.info(msg)
  }
}

export const logger = Logger.build(pino());
