import asyncHandler from "express-async-handler";
import { checkUsernameAvailabilityService } from "../../services/auth/checkUsernameService.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";


export const checkUsernameAvailabilty = asyncHandler(async (req, res) => {
  const { username } = req.query;

  const result = await checkUsernameAvailabilityService(username);

  res.status(HTTP_STATUS.OK).json({
    success: true,
    ...result,
  });
});
