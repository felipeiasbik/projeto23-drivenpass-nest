import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createCardTypesSeed() {
  try {
    const cardsTypes = await prisma.cardType.findMany();
    if (cardsTypes.length === 3)
      throw 'There are already the types of cards in the BD';

    const modelsCardsTypes: string[] = [
      'Crédito',
      'Débito',
      'Crédito e Débito',
    ];

    modelsCardsTypes.forEach(async (type) => {
      await prisma.cardType.create({ data: { type } });
      console.log(`Added ${type} type in database`);
    });

    console.log('Seed done successfully!');
  } catch (error) {
    console.log('An error occurred while running the Seed.');
  } finally {
    await prisma.$disconnect();
  }
}

createCardTypesSeed().catch((err) => {
  console.log(err.message);
});
