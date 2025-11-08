import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.route('/').get(protect, authorize('admin'), getUsers);
router
  .route('/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

export default router;
