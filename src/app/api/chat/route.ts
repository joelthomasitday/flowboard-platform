import { NextRequest, NextResponse } from "next/server";
import { aiService } from "@/services/ai/openai-service";
// import { auth } from "@/auth"; // Assuming auth is configured this way for NextAuth v5

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    // Optional: Get user context if logged in
    // const session = await auth();
    // const userContext = session?.user ? { ...context, user: session.user } : null;

    const stream = await aiService.streamChat(messages, context);

    // Transforming the OpenAI stream into a ReadableStream for Next.js response
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const chunkText = chunk.choices[0]?.delta?.content || "";
            if (chunkText) {
              controller.enqueue(new TextEncoder().encode(chunkText));
            }
          }
          controller.close();
        } catch (streamError: any) {
          console.error("ReadableStream Error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error: any) {
    console.error("Full Chat API Error Stack:", error);
    return NextResponse.json({ 
      error: "Communication breakdown. AI offline.",
      details: error.message
    }, { status: 500 });
  }
}
