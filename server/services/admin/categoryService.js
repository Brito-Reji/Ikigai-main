
import { AppError } from "../../errors/AppError.js";
import { Category } from "../../models/Category.js";
import { Course } from "../../models/Course.js";
import { HTTP_STATUS } from "../../utils/httpStatus.js";

// GET CATEGORIES
export const getCategoriesService = async ({ page, limit, search }) => {
    let query = {};

    if (search) {
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
        ];
    }

    const skip = (page - 1) * limit;

    const categories = await Category.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const categoriesWithCount = await Promise.all(
        categories.map(async (category) => {
            const courseCount = await Course.countDocuments({
                category: category._id,
                published: true,
                blocked: false,
                deleted: { $ne: true },
            });

            return { ...category.toObject(), courseCount };
        })
    );

    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / limit);

    return {
        categories: categoriesWithCount,
        pagination: {
            currentPage: page,
            totalPages,
            totalCategories,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
};

// CREATE CATEGORIES
export const createCategoryService = async ({ name, description }) => {
    if (!name || !description) {
        throw new AppError("Name and description are required", HTTP_STATUS.BAD_REQUEST);
    }

    const exists = await Category.findOne({ name: name.trim() });
    if (exists) throw new AppError("Category already exists", HTTP_STATUS.BAD_REQUEST);

    const category = await Category.create({
        name: name.trim(),
        description: description.trim(),
    });

    return category;
};

// EDIT CATEGORIES
export const editCategoryService = async (categoryId, { name, description }) => {
    if (!name || !description) {
        throw new AppError("Name and description are required", HTTP_STATUS.BAD_REQUEST);
    }
    if (!categoryId) throw new AppError("Category ID is required", HTTP_STATUS.BAD_REQUEST);

    const exists = await Category.findOne({
        name: name.trim(),
        _id: { $ne: categoryId },
    });

    if (exists) throw new AppError("Another category with this name already exists", HTTP_STATUS.BAD_REQUEST);

    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);

    category.name = name.trim();
    category.description = description.trim();
    await category.save();

    return category;
};

// TOGGLE BLOCK
export const toggleCategoryBlockService = async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("Category not found", HTTP_STATUS.NOT_FOUND);

    category.isBlocked = !category.isBlocked;
    await category.save();

    return category;
};
