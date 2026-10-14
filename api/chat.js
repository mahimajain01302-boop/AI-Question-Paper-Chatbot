const SYSTEM_PROMPT = [
  "You are HSC Study Buddy, a friendly tutor for Maharashtra State Board Class 12 Science students.",
  "Help with Physics, Chemistry, Mathematics, Biology, English, exam revision, and questions from previous papers.",
  "Explain answers clearly in simple language. When useful, show steps, formulas, units, and a short practice question.",
  "You may reply in the language the student uses, including Hindi, Marathi, or English.",
  "Do not claim to have verified a specific official past paper or the latest syllabus unless the student provides it. Syllabuses and paper patterns can change; encourage checking current board material when needed.",
  "If a question is ambiguous, ask a short clarifying question. Be supportive and concise."
].join(" ");

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Use POST to send a chat message." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ error: "AI is not configured yet. Add OPENAI_API_KEY to the Vercel project settings, then redeploy." });
  }

  const messages = Array.isArray(req.body && req.body.messages) ? req.body.messages : [];
  const input = messages.slice(-12).map((message) => {
    if (!message || !["user", "assistant"].includes(message.role)) return null;
    const content = typeof message.content === "string" ? message.content.trim().slice(0, 2500) : "";
    return content ? { role: message.role, content } : null;
  }).filter(Boolean);

  if (!input.length || input[input.length - 1].role !== "user") {
    return res.status(400).json({ error: "Type a question before sending." });
  }

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-5-mini",
        instructions: SYSTEM_PROMPT,
        input,
        max_output_tokens: 700,
        store: false
      })
    });

    const result = await upstream.json();
    if (!upstream.ok) {
      console.error("OpenAI API error:", upstream.status, result.error && result.error.code);
      if (upstream.status === 429) {
        return res.status(429).json({ error: "AI usage limit reached or the service is busy. Please try again later." });
      }
      return res.status(502).json({ error: "The AI service could not answer right now. Please try again." });
    }

    const answer = result.output
      ? result.output.flatMap((item) => item.content || [])
          .filter((part) => part.type === "output_text")
          .map((part) => part.text)
          .join("")
      : "";
    if (!answer) return res.status(502).json({ error: "The AI returned an empty answer. Please try again." });
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("Chat request failed:", error.message);
    return res.status(500).json({ error: "Could not reach the AI service. Please try again." });
  }
};