import { Response, Request } from 'express';
import User, { IUser } from '../../schema/User';

/* oauth callback, putProfile */
const callback = (req: Request, res: Response) => {
  // 기본 정보를 입력 했는지. 필드를 따로 만드는 게 좋을 듯?
  return res.redirect('http://localhost:8080'); // 임의로 준 값.
};

const putProfile = (req: Request, res: Response) => {
  const user: IUser = req.body;
  const { _id, ...rest } = user;
  const updateField = {
    ...rest,
    isVerified: true,
  };
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
  User.findByIdAndUpdate(_id, updateField, { new: true }, callback);
};

const getProfile = (req: Request, res: Response) => {
  return res.json({
    user: req.user,
  });
};

const logout = (req: Request, res: Response) => {
  if (req.session) {
    req.session.destroy(err => {
      return res.redirect('http://localhost:8080');
    });
  }
};
export { callback, getProfile, putProfile, logout };
