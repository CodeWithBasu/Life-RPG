import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_SHOP_ITEMS = [
  {
    name: 'Midnight Obsidian Theme',
    cost: 50,
    type: 'THEME',
  },
  {
    name: 'Golden Solar Theme',
    cost: 75,
    type: 'THEME',
  },
  {
    name: 'Dragon Knight Frame',
    cost: 30,
    type: 'FRAME',
  },
  {
    name: 'Arcane Scholar Frame',
    cost: 30,
    type: 'FRAME',
  },
  {
    name: 'The Disciplined Title',
    cost: 20,
    type: 'TITLE',
  },
  {
    name: 'Shadow Realm Walker Title',
    cost: 45,
    type: 'TITLE',
  },
] as const;

async function seed() {
  console.log('Seeding ShopItems...');

  for (const item of SAMPLE_SHOP_ITEMS) {
    const existing = await prisma.shopItem.findFirst({
      where: { name: item.name },
    });

    if (!existing) {
      await prisma.shopItem.create({ data: item });
      console.log(`+ Created ${item.type}: ${item.name} (${item.cost} coins)`);
    } else {
      console.log(`- Item already exists: ${item.name}`);
    }
  }

  console.log('Seeding complete.');
}

seed()
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
