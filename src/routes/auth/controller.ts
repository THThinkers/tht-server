import { Response, Request } from 'express';

const redirected = (req: Request, res: Response) => {
  res.redirect('/');
};

const getProfile = (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
};

export { redirected, getProfile };
