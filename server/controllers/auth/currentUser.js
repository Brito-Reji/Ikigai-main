import asyncHandler from "express-async-handler";
import { getCurrentUserService } from "../../services/auth/currentUserService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

export const currentUser = asyncHandler(async (req, res) => {
  let accessToken = null;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    accessToken = req.headers.authorization.split(" ")[1];
  }

  const user = await getCurrentUserService(accessToken);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    user,
  });
});
