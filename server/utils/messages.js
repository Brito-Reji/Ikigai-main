export const MESSAGES = {
    // Auth
    AUTH: {
        LOGIN_SUCCESS: "Login successful",
        LOGOUT_SUCCESS: "Logged out successfully",
        REGISTER_SUCCESS: "Registration successful",
        OTP_SENT: "OTP sent successfully",
        OTP_VERIFIED: "OTP verified successfully",
        PASSWORD_RESET: "Password reset successfully",
        INVALID_CREDENTIALS: "Invalid credentials",
        GOOGLE_SIGNIN_REQUIRED: "This account was created with Google. Please use Google Sign-In",
    },

    // Error
    ERROR: {
        FIELDS_REQUIRED: "Please provide all required fields",
        NOT_FOUND: "Resource not found",
        USER_NOT_FOUND: "User not found",
        COURSE_NOT_FOUND: "Course not found",
        UNAUTHORIZED: "Unauthorized access",
        FORBIDDEN: "Access denied",
        SERVER_ERROR: "Internal server error",
        USER_BLOCKED: "User is blocked by admin",
        INVALID_EMAIL: "Please provide a valid email address",
        PASSWORD_MIN_LENGTH: "Password must be at least 6 characters long",
        EMAIL_EXISTS: "Email or username already exists",
        OTP_FAILED: "Failed to send OTP. Try again",
    },

    // Cart
    CART: {
        FETCHED: "Cart fetched successfully",
        ADDED: "Added to cart",
        REMOVED: "Removed from cart",
        CLEARED: "Cart cleared successfully",
        SYNCED: "Cart synced successfully",
        COURSE_ID_REQUIRED: "Course ID is required",
    },

    // Wishlist
    WISHLIST: {
        FETCHED: "Wishlist fetched successfully",
        ADDED: "Added to wishlist",
        REMOVED: "Removed from wishlist",
    },

    // Course
    COURSE: {
        FETCHED: "Courses fetched successfully",
        CREATED: "Course created successfully",
        UPDATED: "Course updated successfully",
        DELETED: "Course deleted successfully",
        DETAILS_FETCHED: "Course details fetched successfully",
        PUBLISHED: "Course published successfully",
        UNPUBLISHED: "Course unpublished",
        VERIFICATION_SUBMITTED: "Verification request submitted successfully",
        STATS_FETCHED: "Course statistics fetched successfully",
    },

    // Chapter
    CHAPTER: {
        FETCHED: "Chapters fetched successfully",
        CREATED: "Chapter created successfully",
        UPDATED: "Chapter updated successfully",
        DELETED: "Chapter deleted successfully",
    },

    // Lesson
    LESSON: {
        FETCHED: "Lessons fetched successfully",
        ADDED: "Lesson added successfully",
        UPDATED: "Lesson updated successfully",
        DELETED: "Lesson deleted successfully",
    },

    // Video
    VIDEO: {
        UPLOADED: "Video uploaded successfully",
        NO_FILE: "No video file provided",
        URL_GENERATED: "Signed URL generated",
    },

    // Payment
    PAYMENT: {
        ORDER_CREATED: "Order created successfully",
        VERIFIED: "Payment verified successfully",
    },

    // Profile
    PROFILE: {
        FETCHED: "Profile fetched successfully",
        UPDATED: "Profile updated successfully",
    },

    // Admin
    ADMIN: {
        LOGIN_SUCCESS: "Admin login successful",
        STUDENTS_FETCHED: "Students fetched successfully",
        INSTRUCTORS_FETCHED: "Instructors fetched successfully",
        STATS_FETCHED: "Statistics fetched successfully",
        VERIFICATIONS_FETCHED: "Pending verifications fetched successfully",
    },

    // Category
    CATEGORY: {
        FETCHED: "Categories fetched successfully",
        CREATED: "Category created successfully",
        UPDATED: "Category updated successfully",
        DELETED: "Category deleted successfully",
    },
};
