import express from 'express';
import { upload } from '../config/cloudinary.js';
import { uploadImage, uploadMultipleImages, deleteImage } from '../controllers/uploadController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyAdmin, upload.single('image'), uploadImage);
router.post('/multiple', verifyAdmin, upload.array('images', 10), uploadMultipleImages);
router.delete('/:publicId', verifyAdmin, deleteImage);

export default router;
