const authMiddelware = (req, res, next) => {
  console.log(111);
  if (!req.user) {
    return res.status(401).json({
      message: 'Login Required',
    });
  }
  next();
};

export default authMiddelware;
