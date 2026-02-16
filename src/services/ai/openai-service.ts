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
  /** High performance/Strategic model (Aurora Alpha for deep reasoning). */
  SMART: "openrouter/aurora-alpha",
  /** Fast and cost-effective. */
  FAST: "google/gemini-2.0-flash-lite:preview:free",
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
   * Generate a full narrative report
   */
  async generateNarrativeReport(context: any) {
    try {
      const openai = getOpenRouterClient();
      const response = await openai.chat.completions.create({
        model: MODELS.SMART,
        messages: [
          {
            role: "system",
            content: `You are an elite executive strategy consultant AI for FlowBoard. 
            Generate a comprehensive narrative report for a workspace. 
            The report must be professional, insightful, and strategic.
            
            Return ONLY a JSON object with this exact structure:
            {
              "summary": "2-3 paragraphs of strategic overview using rich, professional language.",
              "productivityDelta": number (between 5 and 25),
              "riskReduction": number (between 10 and 60),
              "timeSaved": number (between 5 and 30),
              "automationSavings": number (between 1000 and 10000),
              "topInsights": ["insight 1", "insight 2", "insight 3"]
            }`
          },
          {
            role: "user",
            content: `Generate a narrative report for this workspace context: ${JSON.stringify(context)}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = response.choices[0].message.content;
      return content ? JSON.parse(content) : null;
    } catch (error: any) {
      console.error("Narrative Report Error:", error);
      throw new Error(`Failed to generate narrative report: ${error.message}`);
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
      
      Keep responses concise, editorial, and helpful. Use markdown for structure.
      
      You have tools to interact with the workspace. If a user asks to "upload", "save", or "create" a task you've discussed, use the create_task tool.`;

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
        tools: [
          {
            type: "function",
            function: {
              name: "create_task",
              description: "Create a new task in the workspace",
              parameters: {
                type: "object",
                properties: {
                  title: { type: "string", description: "The task title" },
                  description: { type: "string", description: "Detailed task description" },
                  projectId: {
                  type: "string",
                  description: "Optional ID of a specific project to associate the task with. If not provided, it will use the workspace's default project."
                },
                priority: {
                  type: "string",
                  enum: ["LOW", "MEDIUM", "HIGH"],
                  description: "Urgency of the task: LOW (routine), MEDIUM (standard), or HIGH (critical/bottleneck)."
                },
                dueDate: {
                  type: "string",
                  description: "Deadline in any standard format (e.g., '2024-12-01', 'tomorrow', 'next Friday')."
                },
                assignee: {
                  type: "string",
                  description: "The name or email of the person this task should be assigned to."
                }
              },
              required: ["title"]
            }
          }
        }
      ],
      tool_choice: "auto"
    });

      return stream;
    } catch (error: any) {
      console.error("AI Streaming Error Details:", error);
      throw new Error(`Failed to start AI stream: ${error.message}`);
    }
  }
};
