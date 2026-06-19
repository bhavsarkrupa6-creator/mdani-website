import prisma from '../config/prisma.js';

export const getBanners = async (req, res, next) => {
  try {
    const { location } = req.query;
    const where = { isActive: true };
    if (location) where.location = location;
    const banners = await prisma.banner.findMany({ where, orderBy: { displayOrder: 'asc' } });
    res.json({ success: true, banners });
  } catch (err) {
    next(err);
  }
};

export const getAllBannersAdmin = async (req, res, next) => {
  try {
    const banners = await prisma.banner.findMany({ orderBy: [{ location: 'asc' }, { displayOrder: 'asc' }] });
    res.json({ success: true, banners });
  } catch (err) {
    next(err);
  }
};

export const createBanner = async (req, res, next) => {
  try {
    const { title, subtitle, image, ctaText, ctaLink, location, displayOrder, isActive } = req.body;
    if (!image || !location) {
      return res.status(400).json({ success: false, message: 'Image and location are required' });
    }
    const banner = await prisma.banner.create({
      data: { title, subtitle, image, ctaText, ctaLink, location, displayOrder: displayOrder ?? 0, isActive: isActive ?? true },
    });
    res.status(201).json({ success: true, banner });
  } catch (err) {
    next(err);
  }
};

export const updateBanner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, subtitle, image, ctaText, ctaLink, location, displayOrder, isActive } = req.body;
    const data = {};
    if (title !== undefined) data.title = title;
    if (subtitle !== undefined) data.subtitle = subtitle;
    if (image !== undefined) data.image = image;
    if (ctaText !== undefined) data.ctaText = ctaText;
    if (ctaLink !== undefined) data.ctaLink = ctaLink;
    if (location !== undefined) data.location = location;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;
    if (isActive !== undefined) data.isActive = isActive;
    const banner = await prisma.banner.update({ where: { id }, data });
    res.json({ success: true, banner });
  } catch (err) {
    next(err);
  }
};

export const deleteBanner = async (req, res, next) => {
  try {
    await prisma.banner.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    next(err);
  }
};

export const updateBannerOrder = async (req, res, next) => {
  try {
    const { bannerOrders } = req.body;
    if (!Array.isArray(bannerOrders)) {
      return res.status(400).json({ success: false, message: 'Invalid request body. Expected an array of banner orders.' });
    }

    const transaction = bannerOrders.map((banner) =>
      prisma.banner.update({
        where: { id: banner.id },
        data: { displayOrder: banner.displayOrder },
      })
    );

    await prisma.$transaction(transaction);
    res.json({ success: true, message: 'Banner order updated successfully' });
  } catch (err) {
    next(err);
  }
};
