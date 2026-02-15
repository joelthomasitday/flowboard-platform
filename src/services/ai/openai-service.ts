import OpenAI from "openai";

/**
 * We use the OpenAI client pointing to OpenRouter for maximum stability 
 * and compatibility with Next.js streaming response patterns.
 */
const getOpenRouterClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is missing from env");
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost", // Optional, for OpenRouter rankings
      "X-Title": "FlowBoard", // Optional
    }
  });
};

const MODELS = {
  /** High performance/Strategic model. */
  SMART: "arcee-ai/trinity-large-preview:free",
  /** Fast and cost-effective. */
  FAST: "google/gemini-2.0-flash:free",
} as const;

export const aiService = {
  /**
   * Generate summarized insights
   */
  async generateInsight(context: any) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.SMART,
        messages: [
          {
            role: "system",
            content: "You are an elite project management AI assistant for FlowBoard. Generate a strategic executive summary. Return valid JSON."
          },
          {
            role: "user",
            content: `Analyze this project data: ${JSON.stringify(context)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : null;
    } catch (error: any) {
      console.error("AI Insight Error:", error);
      throw new Error(`Failed to generate AI insight: ${error.message}`);
    }
  },

  /**
   * Generate subtasks break-down
   */
  async breakDownTask(taskTitle: string, description: string) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.FAST,
        messages: [
          {
            role: "system",
            content: "Break down the task into 3-5 actionable subtasks. Return JSON with a 'subtasks' array."
          },
          {
            role: "user",
            content: `Task: ${taskTitle}\nContext: ${description}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : { subtasks: [] };
    } catch (error: any) {
      console.error("AI Task Breakdown Error:", error);
      return { subtasks: [] };
    }
  },

  /**
   * Streaming chat for the assistant
   */
  async streamChat(messages: { role: string; content: string }[], context: any = null) {
    try {
      const openai = getOpenRouterClient();
      const systemPrompt = `You are FlowBoard AI, a premium, intelligent workspace assistant. 
      Your personality is strategic, design-forward, calm, and helpful.
      You help users manage projects, handle deadlines, and architect their workflows.
      
      Design System Context: "Soft Editorial Pastel" (#FFFDF5 background, #364C84 primary).
      
      ${context ? `USER CONTEXT: ${JSON.stringify(context)}` : "USER IS A GUEST (Demo Mode). Encourage them to sign up to unlock full architecture capabilities."}
      
      Keep responses concise, editorial, and helpful. Use markdown for structure.`;

      const stream = await openai.chat.completions.create({
        model: MODELS.SMART,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.map(m => ({
            role: m.role as "user" | "assistant",
            content: m.content
          }))
        ],
        stream: true,
      });

      return stream;
    } catch (error: any) {
      console.error("AI Streaming Error Details:", error);
      throw new Error(`Failed to start AI stream: ${error.message}`);
    }
  }
};
