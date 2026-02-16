const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const wsId = 'cmlp524vc000oc2d8u82qux74';
  const projects = await prisma.project.findMany({
    where: { workspaceId: wsId },
    include: { _count: { select: { tasks: true } } }
  });
  console.log('Projects in current workspace:', JSON.stringify(projects, null, 2));
  
  const allTasks = await prisma.task.findMany({
    include: { project: true }
  });
  console.log('Total tasks in DB:', allTasks.length);
  allTasks.forEach(t => {
    console.log(`Task: ${t.title} | Project: ${t.project.name} | Workspace: ${t.project.workspaceId}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
