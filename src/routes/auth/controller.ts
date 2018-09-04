import { Response, Request } from 'express';
import axios from 'axios';

const app_key = '62a0c42953c577f681f7d4236b9373f0';
const redirect_uri = 'http://localhost:4000/api/auth/redirected';

const kakaoLogin = (req: Request, res: Response) => {
  axios
    .get(
      `https://kauth.kakao.com/oauth/authorize?client_id=${app_key}&redirect_uri=${redirect_uri}&response_type=code`,
    )
    .catch(err => console.error(err));
};

const redirected = (req: Request, res: Response) => {
  console.log(req);
};

export { kakaoLogin, redirected };
