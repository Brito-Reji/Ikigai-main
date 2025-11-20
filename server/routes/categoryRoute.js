import { Router } from 'express';
import { getCategories, createCategory, editCategory } from '../controllers/admin/catergoryController.js';
import isAdmin from '../middlewares/admin.js';

const router = Router();

// Public route to get all categories
router.get('/', getCategories);

// Admin-only routes for category management
router.post('/', isAdmin, createCategory);
router.put('/:categoryId', isAdmin, editCategory);

export default router;