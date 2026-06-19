import express from 'express';
import {
  getContactInfo,
  updateContactInfo,
  getSiteContent,
  updateSiteContent,
  createContactMessage,
  getContactMessagesAdmin,
  markMessageRead,
  deleteContactMessage,
} from '../controllers/siteController.js';
import { verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Contact info
router.get('/contact-info', getContactInfo);
router.put('/contact-info', verifyAdmin, updateContactInfo);

// Site content
router.get('/content', getSiteContent);
router.put('/content', verifyAdmin, updateSiteContent);

// Contact messages (email inquiry)
router.post('/messages', createContactMessage);
router.get('/messages/admin/all', verifyAdmin, getContactMessagesAdmin);
router.patch('/messages/:id/read', verifyAdmin, markMessageRead);
router.delete('/messages/:id', verifyAdmin, deleteContactMessage);

export default router;
