import prisma from '../config/prisma.js';

// ===== Contact Info (phone/whatsapp/email/address) =====

export const getContactInfo = async (req, res, next) => {
  try {
    let info = await prisma.contactInfo.findFirst();
    if (!info) {
      info = await prisma.contactInfo.create({ data: {} });
    }
    res.json({ success: true, contactInfo: info });
  } catch (err) {
    next(err);
  }
};

export const updateContactInfo = async (req, res, next) => {
  try {
    let info = await prisma.contactInfo.findFirst();
    if (!info) {
      info = await prisma.contactInfo.create({ data: req.body });
    } else {
      info = await prisma.contactInfo.update({ where: { id: info.id }, data: req.body });
    }
    res.json({ success: true, contactInfo: info });
  } catch (err) {
    next(err);
  }
};

// ===== Site Content (hero text, about us, footer, homepage content) =====

export const getSiteContent = async (req, res, next) => {
  try {
    let content = await prisma.siteContent.findFirst();
    if (!content) {
      content = await prisma.siteContent.create({ data: {} });
    }
    res.json({ success: true, content });
  } catch (err) {
    next(err);
  }
};

export const updateSiteContent = async (req, res, next) => {
  try {
    let content = await prisma.siteContent.findFirst();
    if (!content) {
      content = await prisma.siteContent.create({ data: req.body });
    } else {
      content = await prisma.siteContent.update({ where: { id: content.id }, data: req.body });
    }
    res.json({ success: true, content });
  } catch (err) {
    next(err);
  }
};

// ===== Contact Messages (email inquiry form) =====

export const createContactMessage = async (req, res, next) => {
  try {
    const { name, phone, email, productId, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }
    const contactMessage = await prisma.contactMessage.create({
      data: { name, phone: phone || '', email, productId, message },
    });
    res.status(201).json({ success: true, message: 'Message sent successfully', contactMessage });
  } catch (err) {
    next(err);
  }
};

export const getContactMessagesAdmin = async (req, res, next) => {
  try {
    const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

export const markMessageRead = async (req, res, next) => {
  try {
    const message = await prisma.contactMessage.update({
      where: { id: req.params.id },
      data: { isRead: true },
    });
    res.json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

export const deleteContactMessage = async (req, res, next) => {
  try {
    await prisma.contactMessage.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};
