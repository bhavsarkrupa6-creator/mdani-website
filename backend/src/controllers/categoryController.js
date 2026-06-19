import prisma from '../config/prisma.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: { children: { where: { isActive: true }, orderBy: { order: 'asc' } } },
    });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

export const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { children: true, _count: { select: { products: true } } },
    });
    res.json({ success: true, categories });
  } catch (err) {
    next(err);
  }
};

export const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: { children: true },
    });
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, parentId, order } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Name is required' });

    let slug = slugify(name);
    const existing = await prisma.category.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const category = await prisma.category.create({
      data: { name, slug, description, image, parentId: parentId || null, order: order ?? 0 },
    });
    res.status(201).json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, image, parentId, order, isActive } = req.body;

    const data = {};
    if (name !== undefined) {
      data.name = name;
      data.slug = slugify(name);
    }
    if (description !== undefined) data.description = description;
    if (image !== undefined) data.image = image;
    if (parentId !== undefined) data.parentId = parentId || null;
    if (order !== undefined) data.order = order;
    if (isActive !== undefined) data.isActive = isActive;

    const category = await prisma.category.update({ where: { id }, data });
    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category with ${productCount} product(s). Move or delete products first.`,
      });
    }
    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};

export const updateCategoryOrder = async (req, res, next) => {
  try {
    const { categoryOrders } = req.body;
    if (!Array.isArray(categoryOrders)) {
      return res.status(400).json({ success: false, message: 'Invalid request body. Expected an array of category orders.' });
    }

    const transaction = categoryOrders.map((category) =>
      prisma.category.update({
        where: { id: category.id },
        data: { order: category.order },
      })
    );

    await prisma.$transaction(transaction);
    res.json({ success: true, message: 'Category order updated successfully' });
  } catch (err) {
    next(err);
  }
};
