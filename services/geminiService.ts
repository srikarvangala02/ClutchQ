
import { GoogleGenAI, Type } from "@google/genai";
import { GameState, PitStopPrediction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const predictBestTime = async (gameState: GameState): Promise<PitStopPrediction> => {
  const prompt = `
    Analyze this LIVE STADIUM DATA to determine if a fan should leave their seat NOW for a bathroom/concessions break.
    
    SPORT: ${gameState.sport}
    PHASE: ${gameState.gamePhase} (LIVE, BREAK, etc.)
    PERIOD: ${gameState.currentPeriod}
    SITUATION: ${gameState.timeRemaining}
    EVENT: ${gameState.recentEvent}
    COMMERCIAL: ${gameState.isCommercialBreak ? 'YES (Orange Sleeve visible)' : 'NO'}
    SCORE: ${gameState.score.home} - ${gameState.score.away}

    Expert Logic Requirements:
    - GO_NOW: Perfect timing (halftime, TV timeout, long injury delay, between innings).
    - URGENT: The window is closing fast (e.g., end of timeout).
    - WAIT: Critical action is happening or about to happen.

    Return JSON with fields: recommendation (GO_NOW, WAIT, URGENT), reasoning (short, high-energy), estimatedWindow (e.g., "2:30 minutes").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING, enum: ['GO_NOW', 'WAIT', 'URGENT'] },
            reasoning: { type: Type.STRING },
            estimatedWindow: { type: Type.STRING }
          },
          required: ['recommendation', 'reasoning', 'estimatedWindow']
        }
      }
    });

    return JSON.parse(response.text.trim()) as PitStopPrediction;
  } catch (error) {
    console.error("Prediction error:", error);
    return {
      recommendation: 'WAIT',
      reasoning: "Data syncing... stay alert.",
      estimatedWindow: "Unknown"
    };
  }
};
