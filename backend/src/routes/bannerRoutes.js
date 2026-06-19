import express from 'express';
import {
  getBanners,
  getAllBannersAdmin,
  createBanner,
  updateBanner,
  deleteBanner,
  updateBannerOrder,
} from '../controllers/bannerController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getBanners);
router.get('/admin/all', verifyAdmin, getAllBannersAdmin);
router.post('/', verifyAdmin, createBanner);
router.put('/:id', verifyAdmin, updateBanner);
router.delete('/:id', verifyAdmin, deleteBanner);
router.put('/order', verifyAdmin, updateBannerOrder);

export default router;
