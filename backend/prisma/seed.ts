import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SAMPLE_SHOP_ITEMS = [
  {
    name: "Traveler's Cloak",
    cost: 500,
    type: 'FRAME',
  },
  {
    name: "Focus Hood",
    cost: 300,
    type: 'FRAME',
  },
  {
    name: "Scholar's Tome",
    cost: 400,
    type: 'THEME',
  },
  {
    name: "Lantern of Clarity",
    cost: 350,
    type: 'FRAME',
  },
  {
    name: "Lucky Charm",
    cost: 250,
    type: 'THEME',
  },
  {
    name: "Companion",
    cost: 600,
    type: 'TITLE',
  }
];

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
