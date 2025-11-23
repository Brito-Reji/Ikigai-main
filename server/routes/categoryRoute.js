import { Router } from 'express';
import { createCategory, editCategory, toggleCategoryBlock } from '../controllers/admin/catergoryController.js';
import isAdmin from '../middlewares/admin.js';

const router = Router();

// Admin-only routes for category management
router.post('/', isAdmin, createCategory);
router.put('/:categoryId', isAdmin, editCategory);
router.patch('/:categoryId/toggle-block', isAdmin, toggleCategoryBlock);

export default router;