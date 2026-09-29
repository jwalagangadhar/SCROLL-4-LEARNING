import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

app.use(express.json({ limit: "10mb" }));

// Lazy GoogleGenAI initialization
let aiClient = null;
function getGenAI() {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "Scroll 4 Learning Backend", timestamp: new Date().toISOString() });
});

// 2. AI Doubt Solver Endpoint (bilingual Hinglish/English/Regional mentor response)
app.post("/api/ai/doubt-solver", async (req, res) => {
  try {
    const { question, reelTitle, subject, mentorName, timestampSeconds, language = "Hinglish" } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are Top Indian Educator "${mentorName || "Expert Mentor"}" on Scroll 4 Learning (India's premier mentor-reel platform).
A student is watching a Reel titled "${reelTitle || "Concept Reel"}" on Subject: "${subject || "General"}".
Context Timestamp: ${timestampSeconds ? timestampSeconds + "s" : "Throughout the reel"}.
Language Tone: ${language} (Natural, encouraging, practical, with clear step-by-step clarity).

Student's Doubt: "${question}"

Provide an engaging, clear mentor response formatted in structured markdown:
1. **Core Concept Simplified** (2-3 concise, high-impact bullet points or punchy intuition)
2. **Formula / Code / Key Rule** (if applicable, with syntax/derivation note)
3. **Common Trap / Exam Tip** (What students usually get wrong in JEE/NEET/UPSC/Coding/CBSE)
4. **Quick Check Question** (A 1-line check question to test their understanding with the answer revealed at bottom).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        },
      });

      return res.json({
        answer: response.text,
        mentor: mentorName || "VidyaAI Mentor",
        isAiGenerated: true,
      });
    } else {
      // Fallback smart mentor response if API key is not present
      const fallbackResponse = `### 🎯 Concept Breakdown by ${mentorName || "Scroll 4 Learning Expert"}

**1. Intuition & Core Idea:**
${question.length > 30 ? `Great question regarding *${reelTitle || subject}*! The fundamental trick here is remembering the conservation principle and how state transitions propagate.` : `Here is the quickest way to remember this for exams and interviews:`}
- **Step 1:** Break the problem down into its minimal sub-case.
- **Step 2:** Apply the standard formula or algorithmic invariant without skipping boundary conditions.
- **Step 3:** Double check edge cases like $0$, null pointers, or negative indices.

**2. 💡 Pro Exam Tip:**
> *"Never memorize without visualizing the mental model! Practice 2 variations within 24 hours to cement it in your long-term memory."*

**3. 🚀 Quick Test:**
What happens if the initial state is empty or zero? *(Hint: Look at the base condition first!)*`;

      return res.json({
        answer: fallbackResponse,
        mentor: mentorName || "VidyaAI Mentor",
        isAiGenerated: false,
      });
    }
  } catch (error) {
    console.error("AI Doubt Solver error:", error);
    return res.status(500).json({
      error: "Failed to generate answer",
      details: error?.message || "Unknown error",
    });
  }
});

// 2b. AI Voice Doubt Audio Transcription & Smart Formatting
app.post("/api/ai/transcribe-doubt", async (req, res) => {
  try {
    const { rawTranscript, audioBase64, mimeType = "audio/webm", targetExam = "General Student", preferredSubject } = req.body;

    if (!rawTranscript && !audioBase64) {
      return res.status(400).json({ error: "Either rawTranscript or audioBase64 is required" });
    }

    const ai = getGenAI();
    if (ai) {
      let contents = [];

      if (audioBase64) {
        contents.push({
          inlineData: {
            mimeType: mimeType || "audio/webm",
            data: audioBase64,
          },
        });
      }

      const promptText = `You are the AI Audio-to-Doubt Converter for Scroll 4 Learning.
A student recorded their spoken doubt using their voice (often in English, Hindi, or conversational Hinglish while studying on the go).
${rawTranscript ? `Raw speech transcription: "${rawTranscript}"` : `Listen carefully to the attached voice recording.`}
Target Exam/Level: ${targetExam}
Preferred Subject: ${preferredSubject || "Auto-detect"}

Task:
1. Accurately transcribe or refine the spoken words into clear, professional text.
2. Structure it into:
   - "title": A concise, crisp, exam-focused headline question (max 15 words)
   - "content": A structured, clean question body explaining the confusion, step-by-step points, and any mentioned formula/code.
   - "suggestedSubject": One of ["JEE / NEET Prep", "Tech & Coding", "UPSC & Govt Exams", "Class 9-12 CBSE/ICSE", "Spoken English & Communication", "Finance & Stock Market", "AI & Data Science"]
   - "keywords": Array of 3-5 technical keywords/tags.

Respond ONLY with valid JSON in this exact structure:
{
  "transcription": "exact or polished spoken transcription",
  "title": "Concise Core Question Headline",
  "content": "Detailed context and bulleted explanation of where the student is stuck",
  "suggestedSubject": "JEE / NEET Prep",
  "keywords": ["topic1", "topic2"]
}`;

      contents.push(promptText);

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        },
      });

      try {
        const parsed = JSON.parse(response.text || "{}");
        return res.json({
          success: true,
          transcription: parsed.transcription || rawTranscript || "Voice doubt recorded.",
          title: parsed.title || (rawTranscript ? rawTranscript.slice(0, 70) + "..." : "Voice Question"),
          content: parsed.content || rawTranscript || "",
          suggestedSubject: parsed.suggestedSubject || preferredSubject || "JEE / NEET Prep",
          keywords: parsed.keywords || ["Voice Doubt", "MentVidya"],
        });
      } catch (e) {
        return res.json({
          success: true,
          transcription: rawTranscript || "Voice recording processed",
          title: rawTranscript ? (rawTranscript.length > 60 ? rawTranscript.slice(0, 60) + "..." : rawTranscript) : "Voice Question",
          content: rawTranscript || "Spoken doubt question",
          suggestedSubject: preferredSubject || "JEE / NEET Prep",
          keywords: ["Voice Doubt"],
        });
      }
    } else {
      // Local fallback parser
      const clean = (rawTranscript || "").trim();
      const firstSentence = clean.split(/[.?!]/)[0] || clean;
      const title = firstSentence.length > 70 ? firstSentence.slice(0, 70) + "..." : firstSentence || "Voice Question from Student";
      
      let detectedSubject = preferredSubject || "JEE / NEET Prep";
      const lower = clean.toLowerCase();
      if (lower.includes("code") || lower.includes("python") || lower.includes("react") || lower.includes("java") || lower.includes("bug") || lower.includes("api")) {
        detectedSubject = "Tech & Coding";
      } else if (lower.includes("upsc") || lower.includes("constitution") || lower.includes("history") || lower.includes("geography") || lower.includes("prelims")) {
        detectedSubject = "UPSC & Govt Exams";
      } else if (lower.includes("english") || lower.includes("grammar") || lower.includes("pronunciation") || lower.includes("vocab")) {
        detectedSubject = "Spoken English & Communication";
      } else if (lower.includes("stock") || lower.includes("nifty") || lower.includes("trading") || lower.includes("finance") || lower.includes("mutual fund")) {
        detectedSubject = "Finance & Stock Market";
      } else if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("neural") || lower.includes("llm")) {
        detectedSubject = "AI & Data Science";
      }

      return res.json({
        success: true,
        transcription: clean,
        title: title || "Voice Recorded Doubt",
        content: clean ? `**Spoken Context:**\n${clean}\n\n*Recorded on mobile voice recorder while on the go.*` : "Voice question",
        suggestedSubject: detectedSubject,
        keywords: ["Voice Doubt", detectedSubject],
      });
    }
  } catch (error) {
    console.error("Transcribe doubt error:", error);
    return res.status(500).json({
      error: "Failed to transcribe voice doubt",
      details: error?.message || "Unknown error",
    });
  }
});

// 3. AI Reel Summary & Flashcard Cheat-Sheet
app.post("/api/ai/reel-summary", async (req, res) => {
  try {
    const { title, subject, mentorName, description } = req.body;

    const ai = getGenAI();
    if (ai) {
      const prompt = `You are a curriculum lead at Scroll 4 Learning. Summarize this 60-second micro-reel into a high-yield Revision Cheat-sheet.
Reel: "${title}"
Subject: "${subject}"
Mentor: "${mentorName}"
Description: "${description}"

Provide:
1. **⚡ 60-Second TL;DR** (2 sentences)
2. **🔑 3 High-Yield Formulae/Rules/Key Takeaways** (numbered)
3. **🧠 Memory Mnemonic / Visual Trick** (1 clever trick to recall in exams)`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          temperature: 0.6,
        },
      });

      return res.json({
        summary: response.text,
      });
    } else {
      return res.json({
        summary: `### ⚡ 60-Second High-Yield Summary: ${title}

**1. TL;DR:**
This concept is frequently tested in competitive exams. Understanding the underlying derivation takes less than a minute when you focus on the primary invariant.

**2. 🔑 3 Key Takeaways:**
1. Always verify initial boundary conditions before expanding equations or loops.
2. In competitive tests (JEE/NEET/GATE/Tech), time complexity & substitution shortcuts save up to 45 seconds per question.
3. Master the graphical intuition alongside algebraic notation.

**3. 🧠 Memory Mnemonic:**
*Think of the flow like water finding the lowest path—always optimize the recurring state first!*`,
      });
    }
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

// 4. Sponsor Ads Endpoint (for Paywall Unlock & Credit Earn)
app.get("/api/ads/sponsor", (_req, res) => {
  const sponsorAds = [
    {
      id: "ad-unacademy-super50",
      brandName: "Unacademy Phoenix",
      brandTagline: "Crack India's Toughest Exams with Top 1% Mentors",
      rewardCoins: 25,
      durationSeconds: 15,
      videoTheme: "education_live",
      headline: "Get 7-Day Free Unlimited All-Access Pass!",
      description: "Daily live doubts, AIR 1 mock tests, and personalized study planner.",
      ctaText: "Claim Free Pass & Unlock Reel",
      ctaLink: "https://unacademy.com",
      sponsorColor: "from-blue-600 to-indigo-900",
      logoBadge: "🔥 TOP SPONSOR",
    },
    {
      id: "ad-pw-med",
      brandName: "Physics Wallah MedTech",
      brandTagline: "Affordable Quality Learning For Every Indian Corner",
      rewardCoins: 25,
      durationSeconds: 15,
      videoTheme: "doctor_whiteboard",
      headline: "NEET & JEE Visual 3D Concept Library",
      description: "Interactive anatomy, molecular 3D structures & instant camera doubt solver.",
      ctaText: "Explore 3D Library & Unlock Reel",
      ctaLink: "https://pw.live",
      sponsorColor: "from-emerald-600 to-teal-950",
      logoBadge: "⭐ EXAM SPECIAL",
    },
    {
      id: "ad-zerodha-varsity",
      brandName: "Zerodha Varsity India",
      brandTagline: "Free Financial & Stock Market Education",
      rewardCoins: 30,
      durationSeconds: 15,
      videoTheme: "fintech_charts",
      headline: "Master Compounding & Smart Investing",
      description: "Zero fees, zero jargon. 12 comprehensive modules on personal finance.",
      ctaText: "Start Learning Free",
      ctaLink: "https://zerodha.com/varsity",
      sponsorColor: "from-amber-600 to-orange-950",
      logoBadge: "💰 WEALTH SKILLS",
    },
  ];

  // Pick random or cycle
  const randomAd = sponsorAds[Math.floor(Math.random() * sponsorAds.length)];
  res.json({ ad: randomAd });
});

// Vite Middleware for Dev, Static serving for Prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  const listenPort = (port) => {
    const server = app.listen(port, "0.0.0.0", () => {
      console.log(`[Scroll 4 Learning] Server running on http://localhost:${port}`);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.warn(`[Scroll 4 Learning] Port ${port} is in use, trying port ${port + 1}...`);
        listenPort(port + 1);
      } else {
        console.error("Server error:", err);
      }
    });
  };

  listenPort(PORT);
}

startServer();
