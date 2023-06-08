import { type MailService } from '@sendgrid/mail';
import { BASE_URL, CONFIRMATION_EMAIL_SENDER_ADDRESS } from '../config';

export interface NotificationService {
  sendConfirmationEmail: (email: string, token: string) => Promise<void>
}

export class NotificationServiceImpl implements NotificationService {
  constructor (private readonly sendgridMailService: MailService) { }

  async sendConfirmationEmail (email: string, token: string): Promise<void> {
    const confirmationLink = this.getConfirmationLink(email, token);

    const msg = {
      to: email,
      from: CONFIRMATION_EMAIL_SENDER_ADDRESS,
      subject: 'Registration confirmation',
      text: 'Please confirm your email below',
      html: `
        <strong>
          <a href=${confirmationLink}>Confirm you e-mail address</a>
        </strong>
      `
    };

    await this.sendgridMailService.send(msg);
  }

  private getConfirmationLink (email: string, token: string): string {
    return `http://${BASE_URL}/confirm-registration?email=${email}&token=${token}`;
  }
}
