exports.requireAdmin = (req, res, next) => {
  const key = req.headers['x-admin-key'];
  if (!key) {
    return res.status(403).json({ message: 'Admin key required' });
  }
  if (key !== process.env.ADMIN_API_KEY) {
    return res.status(403).json({ message: 'Invalid admin key' });
  }
  next();
};
