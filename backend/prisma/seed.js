import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // ===== Admin =====
  const adminUsername = process.env.ADMIN_SEED_USERNAME || 'mdaniadmin';
  const adminPassword = process.env.ADMIN_SEED_PASSWORD || 'mdaniadmin8210';

  const existingAdmin = await prisma.admin.findUnique({ where: { username: adminUsername } });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 12);
    await prisma.admin.create({ data: { username: adminUsername, password: hashed } });
    console.log(`Admin created: ${adminUsername}`);
  } else {
    console.log('Admin already exists, skipping.');
  }

  // ===== Categories =====
  const categoriesData = [
    { name: 'PlayStation', slug: 'playstation', order: 1 },
    { name: 'Xbox', slug: 'xbox', order: 2 },
    { name: 'Nintendo', slug: 'nintendo', order: 3 },
    { name: 'Games', slug: 'games', order: 4 },
    { name: 'Accessories', slug: 'accessories', order: 5 },
    { name: 'Consoles', slug: 'consoles', order: 6 },
    { name: 'Pre-Owned', slug: 'pre-owned', order: 7 },
    { name: 'Repair Services', slug: 'repair-services', order: 8 },
  ];

  const createdCategories = {};
  for (const cat of categoriesData) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (!existing) {
      const created = await prisma.category.create({ data: cat });
      createdCategories[cat.slug] = created;
      console.log(`Category created: ${cat.name}`);
    } else {
      createdCategories[cat.slug] = existing;
    }
  }

  // ===== Subcategories for PlayStation =====
  const psSubcats = [
    { name: 'PS5 Consoles', slug: 'ps5-consoles' },
    { name: 'PS4 Consoles', slug: 'ps4-consoles' },
    { name: 'PS5 Games', slug: 'ps5-games' },
    { name: 'PS4 Games', slug: 'ps4-games' },
    { name: 'PS Controllers', slug: 'ps-controllers' },
    { name: 'PS Headsets', slug: 'ps-headsets' },
  ];
  for (const sub of psSubcats) {
    const existing = await prisma.category.findUnique({ where: { slug: sub.slug } });
    if (!existing) {
      await prisma.category.create({
        data: { ...sub, parentId: createdCategories['playstation'].id },
      });
      console.log(`Subcategory created: ${sub.name}`);
    }
  }

  // ===== Contact Info =====
  const existingContact = await prisma.contactInfo.findFirst();
  if (!existingContact) {
    await prisma.contactInfo.create({
      data: {
        phone: '+91 00000 00000',
        whatsapp: '+91 00000 00000',
        email: 'info@mdanigames.example',
        address: 'Your Store Address Here, City, State, India',
        googleMapsUrl: '',
      },
    });
    console.log('Contact info created');
  }

  // ===== Site Content =====
  const existingContent = await prisma.siteContent.findFirst();
  if (!existingContent) {
    await prisma.siteContent.create({
      data: {
        heroTitle: 'Level Up Your Game',
        heroSubtitle:
          'Genuine consoles, games & accessories with trusted service and repair support.',
        heroCtaText: 'Shop Now',
        homepageContent: '',
        footerContent: '© Mdani Games & Sales Service. All rights reserved.',
        aboutUsContent:
          'Mdani Games & Sales Service is your trusted local destination for gaming consoles, games, accessories, and repair services.',
      },
    });
    console.log('Site content created');
  }

  // ===== Sample Testimonials =====
  const testimonialCount = await prisma.testimonial.count();
  if (testimonialCount === 0) {
    await prisma.testimonial.createMany({
      data: [
        { name: 'Rohit S.', message: 'Great service and genuine products. Highly recommended!', rating: 5, order: 1 },
        { name: 'Priya M.', message: 'Fixed my PS5 quickly and at a fair price.', rating: 5, order: 2 },
        { name: 'Aman K.', message: 'Good collection of pre-owned games at great prices.', rating: 4, order: 3 },
      ],
    });
    console.log('Sample testimonials created');
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
