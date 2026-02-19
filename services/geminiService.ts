
import { GoogleGenAI, Type } from "@google/genai";
import { Task, WellnessEntry, WorkLog } from "../types";

export class GeminiService {
  private ai: GoogleGenAI | null = null;
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
    if (this.apiKey) {
      try {
        this.ai = new GoogleGenAI({ apiKey: this.apiKey });
      } catch (e) {
        console.error("Failed to initialize Gemini client:", e);
      }
    } else {
      console.warn("Gemini API key is missing. AI features will be disabled.");
    }
  }

  async generateDailyInsight(
    tasks: Task[],
    wellness: WellnessEntry[],
    logs: WorkLog[]
  ) {
    if (!this.ai) return null;

    const models = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash-lite",
      "gemini-flash-latest",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-lite-001",
    ];

    for (const model of models) {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const response = await this.ai.models.generateContent({
            model,
            contents: `Based on the following user data, provide a concise wellness insight. 
Tasks: ${JSON.stringify(
              tasks.map((t) => ({ title: t.title, stress: t.stress }))
            )}
Recent Logs: ${JSON.stringify(logs.slice(0, 3))}
Recent Wellness: ${JSON.stringify(wellness.slice(0, 3))}

Return JSON with keys: title, content, type (warning|info|tip).`,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  type: { type: Type.STRING },
                },
                required: ["title", "content", "type"],
              },
            },
          });

          const text = response.text;
          return text ? JSON.parse(text) : null;
        } catch (error: any) {
          const message: string = error?.message || "";
          const status: number | undefined = error?.status;
          const is503 =
            status === 503 || message.includes("503") || message.includes("unavailable");
          const is429 =
            status === 429 ||
            message.includes("429") ||
            message.toLowerCase().includes("quota exceeded");

          if (is503 && retryCount < maxRetries - 1) {
            retryCount += 1;
            await new Promise((r) =>
              setTimeout(r, 1000 * Math.pow(2, retryCount))
            );
            continue;
          }

          if (is429) {
            console.warn(
              `Gemini model ${model} rate limited (429 or quota). Trying next model.`
            );
            break;
          }

          console.warn(`Gemini model ${model} failed:`, message || error);
          break;
        }
      }
    }

    return {
      title: "Stay Mindful",
      content:
        "Take regular breaks to maintain your focus and energy levels throughout the day.",
      type: "info",
    };
  }

  async getFocusRecommendation(currentTask: string) {
    if (!this.ai)
      return "Focus on one small sub-task at a time to reduce cognitive load.";

    const models = [
      "gemini-3-flash-preview",
      "gemini-2.5-flash-lite",
      "gemini-flash-latest",
      "gemini-2.0-flash-001",
      "gemini-2.0-flash-lite-001",
    ];

    for (const model of models) {
      let retryCount = 0;
      const maxRetries = 3;

      while (retryCount < maxRetries) {
        try {
          const response = await this.ai.models.generateContent({
            model,
            contents: `I am currently working on: "${currentTask}". Give me one very short focus tip (max 20 words).`,
          });
          return response.text;
        } catch (e: any) {
          const message: string = e?.message || "";
          const status: number | undefined = e?.status;
          const is503 =
            status === 503 || message.includes("503") || message.includes("unavailable");
          const is429 =
            status === 429 ||
            message.includes("429") ||
            message.toLowerCase().includes("quota exceeded");

          if (is503 && retryCount < maxRetries - 1) {
            retryCount += 1;
            await new Promise((r) =>
              setTimeout(r, 1000 * Math.pow(2, retryCount))
            );
            continue;
          }

          if (is429) {
            console.warn(
              `Gemini model ${model} rate limited (429 or quota). Trying next model.`
            );
            break;
          }

          break;
        }
      }
    }

    return "Focus on one small sub-task at a time to reduce cognitive load.";
  }
}

export const gemini = new GeminiService();
