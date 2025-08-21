import express from "express";
import fs from "fs";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public")); // نخلي public فيها الموقع

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post("/tts", async (req, res) => {
  try {
    const { text, voice = "alloy" } = req.body;
    if (!text) {
      return res.status(400).json({ error: "أرسل النص المطلوب تحويله إلى صوت" });
    }

    const speech = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice,
      input: text
    });

    const buffer = Buffer.from(await speech.arrayBuffer());

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="speech.mp3"'
    });

    res.send(buffer);
  } catch (err) {
    console.error("❌ خطأ:", err);
    res.status(500).json({ error: "فشل إنشاء الصوت" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 TTS API شغالة على البورت ${PORT}`));