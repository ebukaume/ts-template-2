import { type Request, type Client } from 'node-mailjet';
import { type RequestData } from 'node-mailjet/declarations/request/Request';
import { CONFIRMATION_EMAIL_SENDER_ADDRESS, CONFIRMATION_EMAIL_SENDER_NAME } from '../config';
import { DomainErrror } from '../utils/error';

interface ConfirmationEmailParams {
  name: string
  email: string
  link: string
}

export interface NotificationService {
  sendConfirmationEmail: (input: ConfirmationEmailParams) => Promise<void>
}

export class NotificationServiceImpl implements NotificationService {
  private readonly request: Request;

  constructor (mailjetClient: Client) {
    this.request = mailjetClient.post('send', { version: 'v3.1' });
  }

  async sendConfirmationEmail (input: ConfirmationEmailParams): Promise<void> {
    const { name, email, link } = input;

    const data: RequestData = {
      Messages: [
        {
          From: {
            Email: CONFIRMATION_EMAIL_SENDER_ADDRESS,
            Name: CONFIRMATION_EMAIL_SENDER_NAME
          },
          To: [
            {
              Email: email,
              Name: name
            }
          ],
          Subject: 'Registration confirmation',
          TextPart: 'Please confirm your email address',
          HTMLPart: `
          <strong>
            <a href=${link}>Confirm you e-mail address</a>
          </strong>
        `
        }
      ]
    };

    try {
      await this.request.request(data);
    } catch (error) {
      throw DomainErrror.badGateway();
    }
  }
}
