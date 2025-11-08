import { Router } from 'express';
import { createArticle, getArticles, getArticle, updateArticle, deleteArticle } from '../controllers/articleController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

// Public routes
router.get('/', getArticles);
router.get('/:id', getArticle); // Can be ID or slug

// Authenticated routes
router.use(protect);

// Admin and Editor routes
router.post('/', authorize('admin', 'editor'), createArticle);
router.put('/:id', authorize('admin', 'editor'), updateArticle);

// Admin only routes
router.delete('/:id', authorize('admin'), deleteArticle);

export default router;
