import { Response, Request } from 'express';
import User from '../../schema/User';

const redirected = (req: Request, res: Response) => {
  // 기본 정보를 입력 했는지. 필드를 따로 만드는 게 좋을 듯?
  return res.redirect('http://localhost:8080'); // 임의로 준 값.
};

const getProfile = (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
};
const putProfile = (req: Request, res: Response) => {
  const { userId, name } = req.body;
  const callback = (err, user) => {
    if (err) {
      return res.status(503).json({
        message: 'Database error',
      });
    }
    return res.json({
      user,
    });
  };
  User.findByIdAndUpdate(userId, { name }, { new: true }, callback);
};

const logout = (req: Request, res: Response) => {
  req.logout();
  return res.redirect('/');
};
export { redirected, getProfile, putProfile, logout };
