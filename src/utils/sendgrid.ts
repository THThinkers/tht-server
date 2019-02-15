import sgMail from '@sendgrid/mail';
import { RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';

// 이메일 api키 등록

export interface IMessage {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}
const init = (): RequestHandler => (req, res, next) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY!);
    const from = 'thtforever05@gmail.com';
    const html = fs.readFileSync(path.join(__dirname, 'email.html'), 'utf-8');
    const defaultMsg = {
      from,
      html,
    };
    const send = (
      msg: Partial<IMessage> & Pick<IMessage, 'to' | 'subject' | 'text'>,
    ) => {
      sgMail.send({ ...defaultMsg, ...msg });
    };
    req.sgMail = {
      send,
    };
  } catch (err) {
    next(err);
  }
};
export default { init };
