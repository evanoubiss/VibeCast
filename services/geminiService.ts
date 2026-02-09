import { GoogleGenAI, Type } from "@google/genai";
import { Session, Vote, MoodOption } from "../types";
import { EMOJI_THEME, WEATHER_THEME } from "../constants";

export const generateMoodSummary = async (session: Session) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const themeOptions = session.themeType === 'emoji' 
    ? EMOJI_THEME 
    : (session.themeType === 'weather' ? WEATHER_THEME : session.customOptions || []);

  const voteStats = session.votes.map(v => {
    const option = themeOptions.find(o => o.id === v.moodId);
    return {
      mood: option?.label || 'Unknown',
      reason: v.reason || 'No reason provided',
      kudos: v.kudos || ''
    };
  });

  const kudosList = session.votes.filter(v => v.kudos).map(v => v.kudos);
  
  const prompt = `
    Theme: ${session.themeType.toUpperCase()}
    Session Name: ${session.name}
    Aggregate Data: ${JSON.stringify(voteStats)}
    Kudos Received: ${JSON.stringify(kudosList)}

    Task:
    Write a witty and empathetic 3-sentence summary of the team's vibe using ${session.themeType} metaphors.
    Incorporate the specific Kudos naturally into the narrative.
    If more than 50% of the team is in a negative or low energy state (value < 0.5), provide one specific 'Smart Nudge' team-building tip or actionable item.
  `;

  try {
    const response = await ai.models.generateContent({
      // Fix: Always use the recommended model name for text summarization/Q&A tasks.
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "You are a witty, empathetic agile coach named VibeBot. You specialize in synthesizing team sentiment into creative metaphors and actionable advice. Tone: Professional yet playful.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A 3-sentence creative summary using theme metaphors." },
            actionableTip: { type: Type.STRING, description: "A specific team-building tip if mood is low." },
            dominantVibe: { type: Type.STRING, description: "The single word that describes the overall mood." }
          },
          required: ["summary", "dominantVibe"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Generation Error:", error);
    return {
      summary: "The team's vibe is mysterious today! Technical clouds may be obscuring our view, but the collective energy remains unique.",
      dominantVibe: "Mysterious",
      actionableTip: "Maybe take a 5-minute break to grab a coffee and sync up?"
    };
  }
};