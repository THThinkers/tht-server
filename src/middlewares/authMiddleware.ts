const authMiddelware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      message: 'Login Required',
    });
  }
  next();
};

export default authMiddelware;
