import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// AI Recommendations Endpoint
app.post("/api/recommendations", async (req, res) => {
  try {
    const { tasks, goals, habits, completedPercentage } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(200).json({
        isDemo: true,
        motivationalMessage: "Welcome to DeadlineGenie! To activate full-powered personalized AI suggestions, make sure to add your GEMINI_API_KEY in the Secrets panel. For now, here is a demo plan to kickstart your day!",
        focusPlan: [
          {
            task: "Review and organize tasks",
            reason: "Taking 5 minutes to outline your priority items sets a clear direction for your day.",
            suggestedDuration: "10 mins planning"
          },
          {
            task: "Complete your highest priority item",
            reason: "Tackling the most critical task first removes stress and builds massive momentum.",
            suggestedDuration: "30 mins session"
          }
        ],
        tips: [
          "Use the Pomodoro technique (25 minutes focus, 5 minutes break) to maintain energy.",
          "Group similar tasks together (like study or admin) to avoid context-switching exhaustion."
        ],
        microChallenge: "Drink a glass of water and take 3 deep breaths to clear your mind before diving in!"
      });
    }

    const taskListText = Array.isArray(tasks) && tasks.length > 0
      ? tasks.map((t: any) => `- [${t.completed ? "X" : " "}] ${t.title} (Priority: ${t.priority}, Category: ${t.category}, Deadline: ${t.deadline || "No deadline"})`).join("\n")
      : "No active tasks.";

    const goalListText = Array.isArray(goals) && goals.length > 0
      ? goals.map((g: any) => `- ${g.title}`).join("\n")
      : "No active goals.";

    const habitListText = Array.isArray(habits) && habits.length > 0
      ? habits.map((h: any) => `- ${h.title}`).join("\n")
      : "No active habits.";

    const prompt = `You are DeadlineGenie, an advanced AI productivity companion and smart time-management genie.
Analyze the user's current tasks, goals, habits, and progress percentage, and output a highly personalized, motivating, and actionable productivity recommendation in JSON format.

User Context:
- Current Overall Progress: ${completedPercentage}% task completion.
- Active Goals:
${goalListText}
- Daily Habits:
${habitListText}
- Tasks List:
${taskListText}

Please provide:
1. A brief, personalized motivational greeting/encouragement (1-3 sentences) styled like a encouraging, positive productivity coach/genie.
2. A list of 2-3 specific "Genie recommendations/action items" explaining which task the user should tackle first and why, considering priorities, deadlines, or lack of progress.
3. 2 personalized, practical productivity tips matching the user's current categories or workload.
4. A fun, micro-challenge (e.g., "Take a 5-minute stretch right now", "Do 10 minutes of study focus with Pomodoro") to get them started.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are DeadlineGenie, a supportive and bright AI productivity wizard. You analyze workloads and deliver actionable schedules, time-boxing advice, and positive reinforcement. Ensure your suggestions are realistic and helpful.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["motivationalMessage", "focusPlan", "tips", "microChallenge"],
          properties: {
            motivationalMessage: {
              type: Type.STRING,
              description: "An encouraging, upbeat message based on the user's overall progress.",
            },
            focusPlan: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["task", "reason", "suggestedDuration"],
                properties: {
                  task: { type: Type.STRING, description: "Name/Description of the task to focus on." },
                  reason: { type: Type.STRING, description: "Detailed reason why they should do this task now." },
                  suggestedDuration: { type: Type.STRING, description: "Suggested focus block, e.g., '25 mins Pomodoro' or '45 mins session'." },
                },
              },
              description: "Chronological suggestions of which tasks to prioritize and how to tackle them.",
            },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 personalized, practical productivity or wellness tips based on the workload.",
            },
            microChallenge: {
              type: Type.STRING,
              description: "A small, instantly doable 2-5 minute mini-challenge or icebreaker to boost focus.",
            },
          },
        },
      },
    });

    const recommendationData = JSON.parse(response.text || "{}");
    res.json(recommendationData);
  } catch (error: any) {
    console.error("Gemini Recommendations Error:", error);
    res.status(500).json({
      error: "Failed to generate AI recommendations",
      details: error.message || error,
    });
  }
});

// Setup Vite Dev server / Serve Production static files
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
