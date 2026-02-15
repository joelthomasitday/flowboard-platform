import OpenAI from "openai";
import "dotenv/config";

const k = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: k,
  baseURL: "https://openrouter.ai/api/v1",
});

async function test() {
  try {
    console.log("Sending request via OpenAI Lib...");
    const stream = await openai.chat.completions.create({
      model: "arcee-ai/trinity-large-preview:free",
      messages: [
        {
          role: "user",
          content: "Hello"
        }
      ],
      stream: true
    });

    console.log("Stream started...");
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        process.stdout.write(content);
      }
    }
    console.log("\nDone.");
  } catch (error) {
    console.error("OPENAI LIB TEST FAILED:", error);
  }
}

test();
