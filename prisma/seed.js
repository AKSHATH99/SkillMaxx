import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user1 = await prisma.user.create({
    data: {
      email: 'alice@example.com',
      password: 'hashed_password',
      isCreator: true,
    },
  });

  const project = await prisma.project.create({
    data: {
      title: 'PeerFolio',
      description: 'Showcase your projects and get feedback',
      githubUrl: 'https://github.com/example/peerfolio',
      techStack: ['Next.js', 'PostgreSQL', 'Tailwind'],
      screenshots: ['https://example.com/ss1.png'],
      owner: { connect: { id: user1.id } },
      acceptingCollabs: true,
      collabDescription: 'Looking for someone with UI/UX and backend skills',
    },
  });

  await prisma.collabApplication.create({
    data: {
      projectId: project.id,
      userId: user1.id,
      message: 'Hey! Im interested in contributing.',
    },
  });

  console.log('Seeding done');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  });
