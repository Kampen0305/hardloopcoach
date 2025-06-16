import { GoogleGenAI } from '@google/genai';
import { RunningLevel, RaceDistance } from '../types.js';
import { GEMINI_MODEL_TEXT, WEEKS_PER_DISTANCE } from '../constants.js';

let apiKeyFromEnv;
try {
  if (typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string') {
    apiKeyFromEnv = process.env.API_KEY;
  }
} catch (e) {
  console.warn('Could not access process.env.API_KEY.', e);
}
const API_KEY = apiKeyFromEnv;

if (!API_KEY) {
  console.error('API_KEY is not set. Schedule generation will likely fail.');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatePrompt = (level, distance, preferredTrainingDays) => {
  const numberOfWeeks = WEEKS_PER_DISTANCE[distance];
  let levelDescription = '';
  switch (level) {
    case RunningLevel.BEGINNER:
      levelDescription = 'Een beginner die momenteel moeite heeft met continu hardlopen langer dan 10-15 minuten, of net begint. Het doel is om de afstand comfortabel uit te lopen.';
      break;
    case RunningLevel.INTERMEDIATE:
      levelDescription = `Een gemiddelde loper die al regelmatig 2-3 keer per week hardloopt, en bijvoorbeeld een ${distance === RaceDistance.FIVE_K ? '3km' : '5km'} kan uitlopen. Wil de ${distance} afstand verbeteren of comfortabel uitlopen.`;
      break;
    case RunningLevel.ADVANCED:
      levelDescription = `Een gevorderde loper die al meerdere keren per week traint, ervaring heeft met langere afstanden en verschillende trainingstypes. Wil een snelle tijd neerzetten op de ${distance}.`;
      break;
  }

  let trainingDaysInstruction = '';
  if (preferredTrainingDays && preferredTrainingDays >= 3 && preferredTrainingDays <= 6) {
    trainingDaysInstruction = `De gebruiker heeft een voorkeur voor ${preferredTrainingDays} trainingsdagen per week. Probeer het schema hierop af te stemmen, waarbij de overige dagen rustdagen of actief herstel zijn.`;
  }

  return `Je bent een expert hardloopcoach. Genereer een gedetailleerd wekelijks trainingsschema in het NEDERLANDS voor een hardloper met niveau "${level}" (${levelDescription}) die traint voor een "${distance}".
Het schema moet ${numberOfWeeks} weken duren.
${trainingDaysInstruction}
Geef voor elke week dagelijkse trainingen of rustdagen.
Specificeer voor elke training:
- "day": De dag van de week (Maandag, Dinsdag, etc.).
- "workoutType": Het type training (bijv. Duurloop, Tempotraining, Intervaltraining, Lange Duurloop, Crosstraining, Krachttraining, Rust).
- "duration": Duur van de training (bijv. "30 minuten"). Optioneel.
- "distance": Afstand van de training (bijv. "5 km"). Optioneel.
- "intensity": Intensiteit/tempo (bijv. "Rustig gesprekstempo", "5km wedstrijdtempo", "RPE 7/10"). Optioneel.
- "description": Een korte, duidelijke uitleg van de training in het NEDERLANDS.

Het schema moet een taperperiode bevatten voor de wedstrijd.
De output MOET een valide JSON-object zijn.`;
};

export const generateRunningProgram = async (level, distance, preferredTrainingDays) => {
  if (!API_KEY) {
    throw new Error('De API sleutel is niet geconfigureerd. Kan geen schema genereren.');
  }
  const prompt = generatePrompt(level, distance, preferredTrainingDays);
  let rawOutput = '';
  try {
    const geminiResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: { responseMimeType: 'application/json', temperature: 0.4 },
    });
    rawOutput = geminiResponse.text;
    let jsonStr = rawOutput.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) jsonStr = match[2].trim();
    const parsedData = JSON.parse(jsonStr);
    if (!parsedData.programTitle || !Array.isArray(parsedData.weeklySchedule) || typeof parsedData.totalWeeks !== 'number') {
      throw new Error('Het gegenereerde schema heeft een onverwacht formaat.');
    }
    return parsedData;
  } catch (error) {
    console.error('Error generating running program with Gemini:', error);
    if (error instanceof SyntaxError && rawOutput) {
      throw new Error(`Kon het antwoord van de AI niet verwerken. Respons: ${rawOutput.substring(0, 300)}...`);
    }
    if (error instanceof Error) throw new Error(error.message);
    throw new Error('Onbekende fout bij het genereren van het schema.');
  }
};
