import { PrismaClient } from '@prisma/client';

const SAMPLE_COMMENTS = [
  'Strong technical foundation',
  'Good communication, clear explanations',
  'Struggled with system design',
  'Excellent problem-solving approach',
  'Needs more experience with frontend frameworks',
  'Great culture fit and attitude',
  'Code is tidy but lacks optimization',
  'Solid testing knowledge',
  'Ask more clarifying questions',
  'Delivered a working prototype quickly',
];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    // create 6 users (3 interviewers, 3 candidates)
    const users = [] as Array<{ id: number; email: string; role?: string }>;
    for (let i = 1; i <= 6; i++) {
      const role = i <= 3 ? 'interviewer' : 'candidate';
      const email = `${role}${i}@example.com`;
      const u = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email, name: `${role.charAt(0).toUpperCase() + role.slice(1)} ${i}`, role },
      });
      users.push(u as { id: number; email: string; role?: string });
    }

    // create 6 interviews with a mix of owners
    const interviews = [] as Array<{ id: number }>;
    for (let i = 0; i < 6; i++) {
      const owner = users[randInt(0, users.length - 1)];
      const it = await prisma.interview.create({
        data: {
          title: `Frontend Engineer - Round ${i + 1}`,
          description: `Auto-seeded interview for ${owner.email}`,
          ownerId: owner.id,
        },
      });
      interviews.push(it as { id: number });
    }

    // generate comments across interviews (idempotent: don't duplicate identical comment entries)
    const commentsToCreate = [] as Array<{ interviewId: number; interviewerId?: number; content: string; rating: number }>;
    for (let i = 0; i < 20; i++) {
      const interview = interviews[randInt(0, interviews.length - 1)];
      const interviewer = users[randInt(0, 2)]; // choose from interviewers
      const content = SAMPLE_COMMENTS[randInt(0, SAMPLE_COMMENTS.length - 1)];
      const rating = randInt(2, 5);
      commentsToCreate.push({ interviewId: interview.id, interviewerId: interviewer.id, content, rating });
    }

    // insert comments only if an identical comment (same interviewId, interviewerId, content) doesn't already exist
    let createdComments = 0;
    for (const c of commentsToCreate) {
      const exists = await prisma.comment.findFirst({
        where: {
          interviewId: c.interviewId,
          interviewerId: c.interviewerId,
          content: c.content,
        },
      });
      if (!exists) {
        await prisma.comment.create({ data: c });
        createdComments++;
      }
    }

    console.log('Seed-more (TS) complete — created', users.length, 'users,', interviews.length, 'interviews,', createdComments, 'new comments (skipped duplicates)');
  } catch (e) {
    console.error('Seed-more (TS) failed', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
