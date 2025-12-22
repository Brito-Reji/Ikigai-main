import jwt from "jsonwebtoken";
export const isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
     return next();
    }else{
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (err) {
            return next();
        }
    }

   
}