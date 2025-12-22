import { Router } from "express";
import { getCategories, createCategory, editCategory, toggleCategoryBlock } from "../controllers/admin/catergoryController.js";
import authenticate from "../middlewares/authenticate.js";
import authorize from "../middlewares/authorize.js";

const router = Router();

// Public route to get all categories
router.get("/", authenticate, authorize("admin"), getCategories);

// Admin-only routes for category management
router.post("/", authenticate, authorize("admin"), createCategory);
router.put("/:categoryId", authenticate, authorize("admin"), editCategory);
router.patch("/:categoryId/toggle-block", authenticate, authorize("admin"), toggleCategoryBlock);

export default router;