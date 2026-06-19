import express from 'express';
import {
  createRepairRequest,
  getRepairRequestsAdmin,
  updateRepairStatus,
  deleteRepairRequest,
} from '../controllers/repairController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', createRepairRequest);
router.get('/admin/all', verifyAdmin, getRepairRequestsAdmin);
router.patch('/:id/status', verifyAdmin, updateRepairStatus);
router.delete('/:id', verifyAdmin, deleteRepairRequest);

export default router;
