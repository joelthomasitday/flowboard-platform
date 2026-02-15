import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();

async function main() {
  // 1. Ensure a test workspace exists
  let workspace = await prisma.workspace.findUnique({
    where: { slug: "test-workspace" },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "Test Workspace",
        slug: "test-workspace",
      },
    });
    console.log("✅ Created test workspace");
  }

  // 2. Create a test API key
  const key = "flow_test_" + Math.random().toString(36).substring(2, 15);
  
  await prisma.apiKey.create({
    data: {
      key: key,
      name: "Local Test Key",
      workspaceId: workspace.id,
      isActive: true,
    },
  });

  console.log("\n🚀 TEST API KEY CREATED!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`KEY: ${key}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\nUse this curl command to test the AI route:");
  console.log(`
curl -X POST http://localhost:3000/api/v1/ai \\
  -H "Authorization: Bearer ${key}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "type": "task-breakdown",
    "context": {
      "title": "Fix the landing page hero",
      "description": "The button alignment is broken on mobile devices"
    }
  }'
  `);
}

main()
  .catch((e) => {
    console.error("❌ SCRIPT FAILED");
    console.error("Message:", e.message);
    console.error("Code:", e.code || "No code");
    if (e.meta) console.error("Meta:", JSON.stringify(e.meta));
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
