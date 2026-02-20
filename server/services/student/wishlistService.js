import { Wishlist } from "../../models/Wishlist.js";
import { Course } from "../../models/Course.js";

// get wishlist
export const getWishlistService = async userId => {
  const wishlist = await Wishlist.findOne({ userId })
    .populate({
      path: "courses",
      select:
        "title description price thumbnail instructor category rating students blocked",
      populate: [
        { path: "instructor", select: "firstName lastName" },
        { path: "category", select: "name isBlocked" },
      ],
    })
    .lean();

  if (!wishlist || !wishlist.courses) {
    return [];
  }

  // filter blocked categories and null courses
  const filteredCourses = wishlist.courses.filter(
    course => course && course.category && !course.category.isBlocked
  );

  // price conversion
  const updated = filteredCourses.map(course => ({
    ...course,
    price: course.price / 100,
    priceInPaise: course.price,
  }));
console.log("updated", updated);
  return updated;
};

// add to wishlist
export const addToWishlistService = async (userId, courseId) => {
  const course = await Course.findById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $addToSet: { courses: courseId } },
    { upsert: true, new: true }
  );

  return wishlist;
};

// remove from wishlist
export const removeFromWishlistService = async (userId, courseId) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { userId },
    { $pull: { courses: courseId } },
    { new: true }
  );

  if (!wishlist) {
    throw new Error("Wishlist not found");
  }

  return wishlist;
};

// toggle wishlist
export const toggleWishlistService = async (userId, courseId) => {
  const wishlist = await Wishlist.findOne({ userId });

  const isInWishlist = wishlist?.courses?.some(
    id => id.toString() === courseId.toString()
  );

  if (isInWishlist) {
    await Wishlist.findOneAndUpdate(
      { userId },
      { $pull: { courses: courseId } }
    );
    return { action: "removed", inWishlist: false };
  } else {
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }
    await Wishlist.findOneAndUpdate(
      { userId },
      { $addToSet: { courses: courseId } },
      { upsert: true }
    );
    return { action: "added", inWishlist: true };
  }
};
