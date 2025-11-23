import { Category } from "../../models/Category.js";

export const getCategories = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;

    // Build query
    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const categories = await Category.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalCategories = await Category.countDocuments(query);
    const totalPages = Math.ceil(totalCategories / parseInt(limit));

    return res.status(200).json({
      success: true,
      categories,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCategories,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

export const createCategory = async (req, res) => {
  let { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Name and description are required" });
  }
  let category = await Category.findOne({ name: name.trim() })

  if (category) {
    return res
      .status(409)
      .json({ success: false, message: "Category already exists" });
  }

  await Category.create({ name: name.trim(), description: description.trim() });
  return res
    .status(201)
    .json({ success: true, message: "Category created successfully", category: { name: name, description: description } });
}

export const editCategory = async (req, res) => {
  let { categoryId } = req.params;
  let { name, description } = req.body;

  if (!name || !description) {
    return res
      .status(400)
      .json({ success: false, message: "Name and description are required" });
  }
  if (!categoryId) {
    return res
      .status(400)
      .json({ success: false, message: "Category ID is required" });
  }

  if (name.trim().length === 0 || description.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Name and description cannot be empty" });
  }

  if (await Category.findOne({ name: name.trim(), _id: { $ne: categoryId } })) {
    return res
      .status(409)
      .json({ success: false, message: "Another category with this name already exists" });
  }


  let category = await Category.findById(categoryId);

  if (!category) {
    return res
      .status(404)
      .json({ success: false, message: "Category not found" });
  }

  category.name = name.trim();
  category.description = description.trim();
  await category.save();

  return res
    .status(200)
    .json({ success: true, message: "Category updated successfully" });
}

export const toggleCategoryBlock = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found"
      });
    }

    category.isBlocked = !category.isBlocked;
    await category.save();

    return res.status(200).json({
      success: true,
      message: `Category ${category.isBlocked ? 'blocked' : 'unblocked'} successfully`,
      category
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update category status"
    });
  }
}