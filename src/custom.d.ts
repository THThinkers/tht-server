import { IMessage } from './utils/sendgrid';

declare global {
  namespace Express {
    export interface Request {
      sgMail: {
        send: (
          msg: Partial<IMessage> & Pick<IMessage, 'to' | 'subject' | 'text'>,
        ) => void;
      };
    }
  }
  export interface Error {
    isOperational?: boolean;
  }
}
