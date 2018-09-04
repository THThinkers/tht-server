import { Response, Request } from 'express';
import request from 'request';
// const app_key = '62a0c42953c577f681f7d4236b9373f0';
// const redirect_uri = 'http://localhost:4000/api/auth/redirected';

// const kakaoRequest = request.defaults({
//   baseUrl: 'https://kauth.kakao.com',
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//   },
// });

// const kakaoLogin = (req: Request, res: Response) => {
//   res.setHeader('Content-Type', 'text/html');
//   request.get({
//     url:
//       'https://kauth.kakao.com/oauth/authorize?client_id=62a0c42953c577f681f7d4236b9373f0&redirect_uri=http://localhost:4000/api/auth/redirected&response_type=code',
//     followAllRedirects: true,
//     followOriginalHttpMethod: true,
//   });
//   // res.redirect(
//   //   'https://kauth.kakao.com/oauth/authorize?client_id=62a0c42953c577f681f7d4236b9373f0&redirect_uri=http://localhost:4000/api/auth/redirected&response_type=code',
//   // );
// };

const redirected = (req: Request, res: Response) => {
  console.log(req.user);
};

export { redirected };
