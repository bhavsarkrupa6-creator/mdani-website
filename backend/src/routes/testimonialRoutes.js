import express from 'express';
import {
  getTestimonials,
  getAllTestimonialsAdmin,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '../controllers/testimonialController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.get('/admin/all', verifyAdmin, getAllTestimonialsAdmin);
router.post('/', verifyAdmin, createTestimonial);
router.put('/:id', verifyAdmin, updateTestimonial);
router.delete('/:id', verifyAdmin, deleteTestimonial);

export default router;
