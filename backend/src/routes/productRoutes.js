import express from 'express';
import {
  getProducts,
  getAllProductsAdmin,
  getProductBySlug,
  getProductByIdAdmin,
  createProduct,
  updateProduct,
  toggleStock,
  toggleVisibility,
  deleteProduct,
  getBrands,
} from '../controllers/productController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/meta/brands', getBrands);
router.get('/admin/all', verifyAdmin, getAllProductsAdmin);
router.get('/admin/:id', verifyAdmin, getProductByIdAdmin);
router.get('/:slug', getProductBySlug);

router.post('/', verifyAdmin, createProduct);
router.put('/:id', verifyAdmin, updateProduct);
router.patch('/:id/stock', verifyAdmin, toggleStock);
router.patch('/:id/visibility', verifyAdmin, toggleVisibility);
router.delete('/:id', verifyAdmin, deleteProduct);

export default router;
