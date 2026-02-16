const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  try {
    const workspaces = await prisma.workspace.findMany({
      include: { projects: true }
    });
    
    console.log('--- DB Content ---');
    workspaces.forEach(ws => {
      console.log(`Workspace: ${ws.name} (${ws.id})`);
      ws.projects.forEach(p => {
        console.log(`  Project: ${p.name}`);
      });
    });
    console.log('------------------');
  } catch (err) {
    console.error('Error:', err);
  }
}

main().finally(() => prisma.$disconnect());
