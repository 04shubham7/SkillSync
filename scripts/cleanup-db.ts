import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanup() {
  try {
    console.log('🗑️  Cleaning up database...\n');

    // Delete all comments
    const deletedComments = await prisma.comment.deleteMany();
    console.log(`✅ Deleted ${deletedComments.count} comments`);

    // Delete all interviews
    const deletedInterviews = await prisma.interview.deleteMany();
    console.log(`✅ Deleted ${deletedInterviews.count} interviews`);

    console.log('\n✨ Database cleanup completed!');
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanup();
