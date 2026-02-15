import { OpenRouter } from "@openrouter/sdk";
import "dotenv/config";

const k = process.env.OPENAI_API_KEY;
console.log("Using Key:", k?.substring(0, 10) + "...");

const openrouter = new OpenRouter({
  apiKey: k,
});

async function test() {
  try {
    console.log("Sending request...");
    const stream = await openrouter.chat.send({
      chatGenerationParams: {
        model: "arcee-ai/trinity-large-preview:free",
        messages: [
          {
            role: "user",
            content: "Hello"
          }
        ],
        stream: true
      }
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
    import('fs').then(fs => {
        fs.writeFileSync('errors.json', JSON.stringify(error, (key, value) => {
            if (value instanceof Error) {
                return { name: value.name, message: value.message, stack: value.stack, ...value };
            }
            return value;
        }, 2));
    });
    console.error("TEST FAILED. Check errors.json");
  }
}

test();
