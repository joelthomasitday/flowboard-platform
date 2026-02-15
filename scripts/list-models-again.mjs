import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

async function list() {
  const API_KEY = process.env.OPENAI_API_KEY;
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
    const data = await response.json();
    if (data.models) {
        console.log("Available Models:", data.models.map(m => m.name).join(", "));
    } else {
        console.log("Error or No Models:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(error);
  }
}
list();
