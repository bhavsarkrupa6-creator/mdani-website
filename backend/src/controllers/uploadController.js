import cloudinary from '../config/cloudinary.js';

// POST /api/upload - single image (multer-cloudinary already uploaded it)
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    res.status(201).json({
      success: true,
      url: req.file.path,
      publicId: req.file.filename,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/upload/multiple - multiple images
export const uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    const files = req.files.map((f) => ({ url: f.path, publicId: f.filename }));
    res.status(201).json({ success: true, files });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/upload/:publicId - remove from cloudinary
export const deleteImage = async (req, res, next) => {
  try {
    const { publicId } = req.params;
    // publicId may contain slashes encoded - decode
    const decoded = decodeURIComponent(publicId);
    await cloudinary.uploader.destroy(decoded);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    next(err);
  }
};
