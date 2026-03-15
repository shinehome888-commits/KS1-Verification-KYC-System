const adminApiKey = process.env.ADMIN_API_KEY;

exports.requireAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (key === adminApiKey) return next();
  res.status(403).json({ message: 'Admin access denied' });
};
