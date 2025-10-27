
import jwt from "jsonwebtoken";
import asyncHandler from 'express-async-handler'
export const verifyAdmin = asyncHandler(async(req, res, next) => {
  const token =  req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET );
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
})

export const verifyStudent = asyncHandler(async(req, res, next) => {
  const token =   req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "student")
      return res.status(403).json({ message: "Access denied" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
}
)
export const verifyInstructor = asyncHandler(async(req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "instructor")
      return res.status(403).json({ message: "Access denied" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" })
  }
})


export const getMe = asyncHandler(async (req, res) => {
  const token =
    req.headers.authorization?.split(" ")[1] || req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    res.status(200).json({
      success: true,
      user: {
        id: decoded.id,     
        email: decoded.email,   
        username: decoded.username, 
        role: decoded.role,
      },
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});