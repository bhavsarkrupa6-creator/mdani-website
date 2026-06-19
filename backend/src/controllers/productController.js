import prisma from '../config/prisma.js';

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

// GET /api/products  - public, supports filters
export const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      search,
      minPrice,
      maxPrice,
      brand,
      stockStatus,
      featured,
      sort,
      page = 1,
      limit = 20,
    } = req.query;

    const where = { isPublished: true };

    if (category) {
      where.category = { slug: category };
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseFloat(minPrice);
      if (maxPrice) where.price.lte = parseFloat(maxPrice);
    }
    if (brand) {
      where.brand = { equals: brand, mode: 'insensitive' };
    }
    if (stockStatus) {
      where.stockStatus = stockStatus;
    }
    if (featured === 'true') {
      where.isFeatured = true;
    }

    let orderBy = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    if (sort === 'price_desc') orderBy = { price: 'desc' };
    if (sort === 'name_asc') orderBy = { name: 'asc' };

    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = (Math.max(parseInt(page), 1) - 1) * take;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        take,
        skip,
        include: { category: { select: { name: true, slug: true } } },
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: parseInt(page),
        limit: take,
        totalPages: Math.ceil(total / take),
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/admin/all - admin sees everything incl. hidden/unpublished
export const getAllProductsAdmin = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: { select: { name: true, slug: true } } },
    });
    res.json({ success: true, products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:slug
export const getProductBySlug = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { slug: req.params.slug },
      include: { category: true },
    });
    if (!product || !product.isPublished) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/admin/:id - admin fetch by id (incl. unpublished)
export const getProductByIdAdmin = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true },
    });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products - admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      specifications,
      features,
      price,
      discountPrice,
      stockStatus,
      isPublished,
      isFeatured,
      image,
      galleryImages,
      categoryId,
      brand,
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ success: false, message: 'Name, price, and category are required' });
    }

    let slug = slugify(name);
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        specifications: specifications || {},
        features: features || [],
        price: parseFloat(price),
        discountPrice: discountPrice ? parseFloat(discountPrice) : null,
        stockStatus: stockStatus || 'IN_STOCK',
        isPublished: isPublished ?? true,
        isFeatured: isFeatured ?? false,
        image,
        galleryImages: galleryImages || [],
        categoryId,
        brand,
      },
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id - admin
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const data = {};

    if (body.name !== undefined) {
      data.name = body.name;
      data.slug = slugify(body.name);
    }
    if (body.description !== undefined) data.description = body.description;
    if (body.specifications !== undefined) data.specifications = body.specifications;
    if (body.features !== undefined) data.features = body.features;
    if (body.price !== undefined) data.price = parseFloat(body.price);
    if (body.discountPrice !== undefined) data.discountPrice = body.discountPrice ? parseFloat(body.discountPrice) : null;
    if (body.stockStatus !== undefined) data.stockStatus = body.stockStatus;
    if (body.isPublished !== undefined) data.isPublished = body.isPublished;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.image !== undefined) data.image = body.image;
    if (body.galleryImages !== undefined) data.galleryImages = body.galleryImages;
    if (body.categoryId !== undefined) data.categoryId = body.categoryId;
    if (body.brand !== undefined) data.brand = body.brand;

    const product = await prisma.product.update({ where: { id }, data });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/stock - quick toggle
export const toggleStock = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { stockStatus } = req.body;
    if (!['IN_STOCK', 'OUT_OF_STOCK'].includes(stockStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid stock status' });
    }
    const product = await prisma.product.update({ where: { id }, data: { stockStatus } });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/products/:id/visibility
export const toggleVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;
    const product = await prisma.product.update({ where: { id }, data: { isPublished: !!isPublished } });
    res.json({ success: true, product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id - admin
export const deleteProduct = async (req, res, next) => {
  try {
    await prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/meta/brands - distinct brands for filter UI
export const getBrands = async (req, res, next) => {
  try {
    const brands = await prisma.product.findMany({
      where: { isPublished: true, brand: { not: null } },
      select: { brand: true },
      distinct: ['brand'],
    });
    res.json({ success: true, brands: brands.map((b) => b.brand).filter(Boolean) });
  } catch (err) {
    next(err);
  }
};
