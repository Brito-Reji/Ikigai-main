import jwt from "jsonwebtoken";
const isAdmin = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
  if (decoded.role !== "admin") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};
export default isAdmin;
