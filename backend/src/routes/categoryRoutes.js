import express from 'express';
import {
  getCategories,
  getAllCategoriesAdmin,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  updateCategoryOrder,
} from '../controllers/categoryController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/admin/all', verifyAdmin, getAllCategoriesAdmin);
router.get('/:slug', getCategoryBySlug);
router.post('/', verifyAdmin, createCategory);
router.put('/:id', verifyAdmin, updateCategory);
router.delete("/:id", verifyAdmin, deleteCategory);
router.put("/order", verifyAdmin, updateCategoryOrder);

export default router;
