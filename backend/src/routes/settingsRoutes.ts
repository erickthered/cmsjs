import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = Router();

router.route('/').get(protect, authorize('admin'), getSettings).put(protect, authorize('admin'), updateSettings);

export default router;
