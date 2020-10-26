module.exports = function roleFilter(...roles) {
  return (req, res, next) => {
    const { user } = req;

    if (!roles.includes(user.role)) {
      res.status(403);
      res.send();
    }

    next();
  };
};
