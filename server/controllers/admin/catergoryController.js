import asyncHandler from "express-async-handler";
import {
  getCategoriesService,
  createCategoryService,
  editCategoryService,
  toggleCategoryBlockService,
} from "../../services/admin/categoryService.js";

//  GET CATEGORIES
export const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const search = req.query.search || "";

  const result = await getCategoriesService({ page, limit, search });

  res.status(200).json({ success: true, ...result });
});

// CREATE CATEGORY
export const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const category = await createCategoryService({ name, description });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

// EDIT CATEGORY
export const editCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { name, description } = req.body;

  await editCategoryService(categoryId, { name, description });

  res.status(200).json({
    success: true,
    message: "Category updated successfully",
  });
});

// TOGGLE BLOCK
export const toggleCategoryBlock = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await toggleCategoryBlockService(categoryId);

  res.status(200).json({
    success: true,
    message: `Category ${category.isBlocked ? "blocked" : "unblocked"} successfully`,
    category,
  });
});
