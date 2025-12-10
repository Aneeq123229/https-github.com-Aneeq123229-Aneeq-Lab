import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to decode Base64 for Audio
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Ad Creator Service
 */
export const generateAdCopy = async (productName: string, audience: string, keyFeatures: string) => {
  try {
    const prompt = `Write a compelling digital advertisement for a product named "${productName}". 
    Target Audience: ${audience}. 
    Key Features: ${keyFeatures}.
    
    Return the response in JSON format with the following structure:
    {
      "headline": "Catchy Headline",
      "body": "Persuasive body text...",
      "cta": "Call to action"
    }`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            body: { type: Type.STRING },
            cta: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Ad Gen Error:", error);
    throw error;
  }
};

/**
 * Image Generation Service (Logo & Thumbnail)
 */
export const generateImage = async (prompt: string, aspectRatio: "1:1" | "16:9" = "1:1") => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          // imageSize: "1K" // Only for Pro models
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Gen Error:", error);
    throw error;
  }
};

/**
 * Song Creator Service (Lyrics + TTS)
 */
export const generateSong = async (topic: string, mood: string): Promise<{ lyrics: string, audioBuffer: AudioBuffer }> => {
  try {
    // 1. Generate Lyrics
    const lyricPrompt = `Write short, rhyming song lyrics (about 4-6 lines) about "${topic}". The mood is ${mood}. Do not include verse labels like "Verse 1", just the lyrics.`;
    
    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: lyricPrompt,
    });
    
    const lyrics = textResponse.text || "Could not generate lyrics.";

    // 2. Generate Audio (TTS)
    // Using TTS model to "read/perform" the lyrics.
    const speechResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: lyrics }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Fenrir' }, // Deep, resonant voice suitable for narration/song-speech
          },
        },
      },
    });

    const base64Audio = speechResponse.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    
    if (!base64Audio) {
      throw new Error("No audio data generated");
    }

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
    const audioBuffer = await decodeAudioData(
      decode(base64Audio),
      outputAudioContext,
      24000,
      1,
    );

    return { lyrics, audioBuffer };

  } catch (error) {
    console.error("Song Gen Error:", error);
    throw error;
  }
};
