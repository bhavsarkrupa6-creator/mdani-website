import prisma from '../config/prisma.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalProducts,
      totalCategories,
      pendingRepairs,
      totalRepairs,
      unreadMessages,
      totalMessages,
      recentProducts,
      recentRepairs,
      recentMessages,
      outOfStockCount,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.repairRequest.count({ where: { status: 'PENDING' } }),
      prisma.repairRequest.count(),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.contactMessage.count(),
      prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { category: { select: { name: true } } },
      }),
      prisma.repairRequest.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
      prisma.product.count({ where: { stockStatus: 'OUT_OF_STOCK' } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalProducts,
        totalCategories,
        pendingRepairs,
        totalRepairs,
        unreadMessages,
        totalMessages,
        outOfStockCount,
      },
      recentActivity: {
        products: recentProducts,
        repairRequests: recentRepairs,
        messages: recentMessages,
      },
    });
  } catch (err) {
    next(err);
  }
};
