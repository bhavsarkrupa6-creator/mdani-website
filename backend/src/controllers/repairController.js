import prisma from '../config/prisma.js';

export const createRepairRequest = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      email,
      deviceType,
      brand,
      model,
      problemDescription,
      images,
      preferredContact,
    } = req.body;

    if (!name || !phone || !email || !deviceType || !problemDescription) {
      return res.status(400).json({
        success: false,
        message: 'Name, phone, email, device type, and problem description are required',
      });
    }

    const repairRequest = await prisma.repairRequest.create({
      data: {
        name,
        phone,
        email,
        deviceType,
        brand: brand || '',
        model: model || '',
        problemDescription,
        images: images || [],
        preferredContact: preferredContact || 'PHONE',
      },
    });

    res.status(201).json({ success: true, message: 'Repair request submitted', repairRequest });
  } catch (err) {
    next(err);
  }
};

export const getRepairRequestsAdmin = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;
    const repairRequests = await prisma.repairRequest.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, repairRequests });
  } catch (err) {
    next(err);
  }
};

export const updateRepairStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['PENDING', 'CONTACTED', 'IN_PROGRESS', 'COMPLETED'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const repairRequest = await prisma.repairRequest.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, repairRequest });
  } catch (err) {
    next(err);
  }
};

export const deleteRepairRequest = async (req, res, next) => {
  try {
    await prisma.repairRequest.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Repair request deleted' });
  } catch (err) {
    next(err);
  }
};
