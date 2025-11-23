import { Router } from 'express';
import { getCategories, createCategory, editCategory } from '../controllers/admin/catergoryController.js';
import isAdmin from '../middlewares/admin.js';

const router = Router();



// Admin-only routes for category management
router.post('/', isAdmin, createCategory);
router.put('/:categoryId', isAdmin, editCategory);

export default router;