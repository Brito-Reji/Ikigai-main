// utils/generateTokens.js
import jwt from 'jsonwebtoken'

const generateTokens = ({userId,email,username,firstName,role,profileImageUrl,isVerified}) => {
  // Short-lived access token (15min - 1hr)
  const accessToken = jwt.sign(
    {
      id: userId,
      email,
      username,
      firstName,
      role,
      profileImageUrl,
      isVerified,
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );

  // Long-lived refresh token (7-30 days)
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};

export  {generateTokens}
