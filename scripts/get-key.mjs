import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const prisma = new PrismaClient();

async function hack() {
  try {
    const keys = await prisma.apiKey.findMany({ take: 5 });
    if (keys.length > 0) {
      console.log("FOUND_KEY=" + keys[0].key);
    } else {
      // Create one
      let ws = await prisma.workspace.findFirst();
      if (!ws) {
        ws = await prisma.workspace.create({ data: { name: "Test", slug: "test-" + Date.now() } });
      }
      const newKey = "test_key_" + Date.now();
      await prisma.apiKey.create({ data: { key: newKey, workspaceId: ws.id, name: "Auto Test Key" } });
      console.log("FOUND_KEY=" + newKey);
    }
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}
hack();
