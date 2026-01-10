import { Admin } from "../../models/Admin.js";
import { Instructor } from "../../models/Instructor.js";
import { User } from "../../models/User.js";


export const logoutService = async refreshToken => {
  if (!refreshToken) {
    return;
  }

  let user =
    (await User.findOne({ refreshToken })) ||
    (await Instructor.findOne({ refreshToken })) ||
    (await Admin.findOne({ refreshToken }));

  if (user) {
    user.refreshToken = null;
    await user.save({ validateBeforeSave: false });
  }
};
