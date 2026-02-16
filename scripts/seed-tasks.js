const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding data...');
  
  // 1. Create/Update Workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'main-workspace' },
    update: {},
    create: {
      name: 'Main Workspace',
      slug: 'main-workspace',
      planType: 'pro',
    },
  });

  // 2. Clear existing projects/tasks to have a clean demo state (optional but good for consistency)
  await prisma.task.deleteMany({});
  await prisma.project.deleteMany({});

  // 3. Create Specific Projects for Demo
  const designSystem = await prisma.project.create({
    data: {
      name: 'Design System',
      description: 'Core brand identity and UI component library.',
      workspaceId: workspace.id,
    },
  });

  const mobileApp = await prisma.project.create({
    data: {
      name: 'Mobile App',
      description: 'iOS and Android companion applications.',
      workspaceId: workspace.id,
    },
  });

  const apiIntegration = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Third-party ecosystem connectors.',
      workspaceId: workspace.id,
    },
  });

  const evolution = await prisma.project.create({
    data: {
      name: 'FlowBoard Evolution',
      description: 'Major architectural overhaul and aesthetic refinement.',
      workspaceId: workspace.id,
    },
  });

  // 4. Create Tasks for Design System (High Progress)
  await prisma.task.createMany({
    data: [
      { title: 'Color Palette Definition', status: 'COMPLETED', priority: 'HIGH', projectId: designSystem.id },
      { title: 'Typography System', status: 'COMPLETED', priority: 'HIGH', projectId: designSystem.id },
      { title: 'Component Library (V1)', status: 'COMPLETED', priority: 'MEDIUM', projectId: designSystem.id },
      { title: 'Motion Tokens', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: designSystem.id },
    ],
  });

  // 5. Create Tasks for Evolution (Lower Progress)
  await prisma.task.createMany({
    data: [
      { title: 'Finalize core design system tokens', status: 'COMPLETED', priority: 'HIGH', projectId: evolution.id },
      { title: 'Implement responsive dashboard sidebar', status: 'IN_PROGRESS', priority: 'MEDIUM', projectId: evolution.id },
      { title: 'Define micro-interaction motion curves', status: 'TODO', priority: 'LOW', projectId: evolution.id },
      { title: 'Refactor project view for editorial aesthetic', status: 'TODO', priority: 'HIGH', projectId: evolution.id },
    ],
  });

  console.log('Seed completed successfully!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

