const isStudent = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET)
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (decoded.role !== 'student') {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next();
}

export default isStudent;