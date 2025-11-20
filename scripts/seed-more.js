const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const users = [];
    for (let i = 1; i <= 3; i++) {
      const u = await prisma.user.upsert({
        where: { email: `user${i}@local` },
        update: {},
        create: { email: `user${i}@local`, name: `User ${i}`, role: i === 1 ? 'interviewer' : 'candidate' },
      });
      users.push(u);
    }

    const interviews = [];
    for (let i = 0; i < users.length; i++) {
      const it = await prisma.interview.create({
        data: {
          title: `Interview ${i + 1}`,
          description: `Auto-seeded interview ${i + 1}`,
          ownerId: users[i].id,
        },
      });
      interviews.push(it);
    }

    // add a few comments to interview 1
    await prisma.comment.createMany({
      data: [
        { interviewId: interviews[0].id, interviewerId: users[0].id, content: 'Great candidate', rating: 5 },
        { interviewId: interviews[0].id, interviewerId: users[0].id, content: 'Needs improvement on designs', rating: 3 },
      ],
    });

    console.log('Seed-more complete');
  } catch (e) {
    console.error('Seed-more failed', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) main();
