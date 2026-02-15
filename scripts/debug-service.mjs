import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../.env.local") });

const genAI = new GoogleGenerativeAI(process.env.OPENAI_API_KEY);

async function test() {
  console.log("🚀 Debugging AI Service logic...");
  try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: SchemaType.OBJECT,
            properties: {
              subtasks: {
                type: SchemaType.ARRAY,
                items: {
                  type: SchemaType.OBJECT,
                  properties: {
                    title: { type: SchemaType.STRING },
                    estimated_hours: { type: SchemaType.NUMBER },
                  },
                  required: ["title", "estimated_hours"],
                }
              }
            },
            required: ["subtasks"],
          },
        }
      });

      const prompt = `Break down: Fix login page. Context: Login button broken on mobile.`;
      const result = await model.generateContent(prompt);
      const res = await result.response;
      console.log("✅ SUCCESS!");
      console.log(res.text());
  } catch (e) {
    console.error("❌ ERROR DETECTED:");
    console.error(e);
  }
}

test();
