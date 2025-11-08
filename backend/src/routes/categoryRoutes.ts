import { Router } from 'express';
import { createCategory, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getCategories);
router.get('/:id', getCategory); // Can be ID or slug

// Admin only routes
router.use(protect, authorize('admin'));

router.post('/', createCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
