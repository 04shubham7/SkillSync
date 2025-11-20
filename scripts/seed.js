const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    // Upsert a test user
    const user = await prisma.user.upsert({
      where: { email: 'test@local' },
      update: { name: 'Test User', role: 'interviewer', image: null },
      create: { email: 'test@local', name: 'Test User', role: 'interviewer', image: null },
    });

    // Create a sample interview owned by the test user
    const interview = await prisma.interview.create({
      data: {
        title: 'Sample Interview',
        description: 'This is a seeded interview for local testing',
        ownerId: user.id,
      },
    });

    console.log('Seed complete: user id=', user.id, ' interview id=', interview.id);
  } catch (e) {
    console.error('Seed failed', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
