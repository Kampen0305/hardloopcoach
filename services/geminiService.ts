
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RunningLevel, RaceDistance, GeminiTrainingProgramResponse, TrainingProgram } from '../types';
import { GEMINI_MODEL_TEXT, WEEKS_PER_DISTANCE } from '../constants.tsx'; // Corrected import path

let apiKeyFromEnv: string | undefined;

try {
  if (typeof process !== 'undefined' && process.env && typeof process.env.API_KEY === 'string') {
    apiKeyFromEnv = process.env.API_KEY;
  } else {
    apiKeyFromEnv = undefined;
  }
} catch (e) {
  apiKeyFromEnv = undefined;
  console.warn("Could not access process.env.API_KEY. This is expected in a client-side only environment without a build step.", e);
}

const API_KEY = apiKeyFromEnv;

if (!API_KEY) {
  // This log is helpful for developers, but a user-facing error will be thrown by generateRunningProgram
  console.error("API_KEY is not effectively set. Ensure it is available via process.env or other means if required by your deployment. The application will likely fail to generate schedules if a key is mandatory for the API.");
}

// It's important that GoogleGenAI is initialized, even if API_KEY is undefined.
// The SDK might handle this gracefully or error upon first API call.
// The non-null assertion operator (!) is used because if API_KEY is truly required at initialization
// and is undefined, it's better to let it potentially error here if the SDK expects a string,
// though often SDKs allow undefined and error on the actual call.
// Given the above logic, API_KEY will be string | undefined.
// The SDK's constructor type for apiKey is `string | undefined`.
const ai = new GoogleGenAI({ apiKey: API_KEY });

const generatePrompt = (level: RunningLevel, distance: RaceDistance, preferredTrainingDays?: number): string => {
  const numberOfWeeks = WEEKS_PER_DISTANCE[distance];
  
  let levelDescription = "";
  switch(level) {
    case RunningLevel.BEGINNER:
      levelDescription = "Een beginner die momenteel moeite heeft met continu hardlopen langer dan 10-15 minuten, of net begint. Het doel is om de afstand comfortabel uit te lopen.";
      break;
    case RunningLevel.INTERMEDIATE:
      levelDescription = `Een gemiddelde loper die al regelmatig 2-3 keer per week hardloopt, en bijvoorbeeld een ${distance === RaceDistance.FIVE_K ? '3km' : '5km'} kan uitlopen. Wil de ${distance} afstand verbeteren of comfortabel uitlopen.`;
      break;
    case RunningLevel.ADVANCED:
      levelDescription = `Een gevorderde loper die al meerdere keren per week traint, ervaring heeft met langere afstanden en verschillende trainingstypes. Wil een snelle tijd neerzetten op de ${distance}.`;
      break;
  }

  let trainingDaysInstruction = "";
  if (preferredTrainingDays && preferredTrainingDays >= 3 && preferredTrainingDays <= 6) {
    trainingDaysInstruction = `De gebruiker heeft een voorkeur voor ${preferredTrainingDays} trainingsdagen per week. Probeer het schema hierop af te stemmen, waarbij de overige dagen rustdagen of actief herstel zijn. Als dit aantal niet optimaal is voor het niveau en de afstand, pas het dan logisch aan en leg kort uit waarom in de week summary indien nodig.`;
  }

  return `
Je bent een expert hardloopcoach. Genereer een gedetailleerd wekelijks trainingsschema in het NEDERLANDS voor een hardloper met niveau "${level}" (${levelDescription}) die traint voor een "${distance}".
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
De output MOET een valide JSON-object zijn volgens de volgende TypeScript interface:
interface TrainingProgram {
  programTitle: string; // e.g., "Jouw 5km Trainingsplan (Beginner)"
  totalWeeks: number; // e.g., 8
  weeklySchedule: WeeklySchedule[];
}
interface WeeklySchedule {
  week: number; // e.g., 1
  summary: string; // Focus van de week in het NEDERLANDS
  days: Workout[];
}
interface Workout {
  day: string; // e.g., "Maandag"
  workoutType: string; // e.g., "Duurloop", "Interval", "Rust"
  duration?: string; // e.g., "30 minuten"
  distance?: string; // e.g., "5 km"
  intensity?: string; // e.g., "Rustig tempo"
  description: string; // Gedetailleerde uitleg in het NEDERLANDS
}

Voorbeeld JSON structuur:
{
  "programTitle": "Jouw ${distance} Trainingsplan (${level})",
  "totalWeeks": ${numberOfWeeks},
  "weeklySchedule": [
    {
      "week": 1,
      "summary": "Focus van de week (bijv. basis kilometers opbouwen) in het NEDERLANDS.",
      "days": [
        { "day": "Maandag", "workoutType": "Rust", "description": "Actief herstel indien nodig." },
        { "day": "Dinsdag", "workoutType": "Duurloop", "duration": "30 minuten", "intensity": "Rustig gesprekstempo", "description": "Focus op een consistente, gemakkelijke inspanning." },
        // ... andere dagen ...
        { "day": "Zondag", "workoutType": "Lange Duurloop", "distance": "8 km", "intensity": "Rustig, gesprekstempo", "description": "Uithoudingsvermogen opbouwen." }
      ]
    }
    // ... andere weken ...
  ]
}

Zorg ervoor dat alle tekstuele waarden zoals programTitle, summary, workoutType, en description in het NEDERLANDS zijn.
Geef voor beginners kortere trainingen/afstanden en meer rustdagen (respecteer de ${preferredTrainingDays} dagen indien mogelijk).
Geef voor gevorderden meer volume en specifieke snelheidstraining (respecteer de ${preferredTrainingDays} dagen indien mogelijk).
Intervaltrainingen moeten de werk- en herstelperiodes specificeren in de beschrijving.
Voorbeeld interval beschrijving: "Loop 4x400m op 5km wedstrijdtempo, met 400m dribbel/wandel herstel tussendoor. Inclusief 10 min warming-up en 10 min cooling-down."
Zorg ervoor dat de weeknummers correct en opeenvolgend zijn.
De 'summary' per week moet relevant zijn voor de trainingen in die week.
`;
};


export const generateRunningProgram = async (
  level: RunningLevel,
  distance: RaceDistance,
  preferredTrainingDays?: number
): Promise<TrainingProgram> => {
  if (!API_KEY) {
    // User-facing error for missing API key
    throw new Error("De API sleutel is niet geconfigureerd. Kan geen schema genereren. Neem contact op met de beheerder.");
  }
  const prompt = generatePrompt(level, distance, preferredTrainingDays);
  let rawGeminiTextOutput = ""; 

  try {
    // console.log("Sending prompt to Gemini:", prompt); // Keep for debugging if needed
    const geminiResponse: GenerateContentResponse = await ai.models.generateContent({
      model: GEMINI_MODEL_TEXT,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.4, // Slightly lower for more deterministic structured output
      },
    });
    
    rawGeminiTextOutput = geminiResponse.text; 
    // console.log("Raw Gemini response text:", rawGeminiTextOutput); // Keep for debugging

    let jsonStr = rawGeminiTextOutput.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    // Attempt to parse the cleaned JSON string
    const parsedData = JSON.parse(jsonStr) as GeminiTrainingProgramResponse;

    // Basic validation of the parsed structure
    if (!parsedData.programTitle || !parsedData.weeklySchedule || !Array.isArray(parsedData.weeklySchedule) || typeof parsedData.totalWeeks !== 'number') {
      console.error("Parsed data is not in the expected format:", parsedData);
      throw new Error("Het gegenereerde schema heeft een onverwacht formaat. Probeer het opnieuw of pas de parameters aan.");
    }
    
    // Additional validation for weekly schedule content
    if (parsedData.weeklySchedule.some(week => !week.days || !Array.isArray(week.days) || typeof week.week !== 'number')) {
        console.error("Parsed weekly schedule data is malformed:", parsedData.weeklySchedule);
        throw new Error("Een deel van het wekelijkse schema heeft een onverwacht formaat. Probeer het opnieuw.");
    }

    return parsedData;

  } catch (error) {
    console.error("Error generating running program with Gemini:", error);
    // Log the raw output if parsing failed, for easier debugging
    if (error instanceof SyntaxError && rawGeminiTextOutput) {
         throw new Error(`Kon het antwoord van de AI niet correct verwerken (JSON parse error). De AI gaf mogelijk een ongeldig antwoord. Probeer het opnieuw. Respons (deel): ${rawGeminiTextOutput.substring(0, 300)}...`);
    }
    if (error instanceof Error) {
        const errorWithCause = error as Error & { cause?: { message?: string } };
        // Check for specific API key related errors (case-insensitive)
        if (
            error.message.toLowerCase().includes("api key not valid") ||
            error.message.toLowerCase().includes("api_key_invalid") ||
            (errorWithCause.cause && typeof errorWithCause.cause.message === 'string' && errorWithCause.cause.message.toLowerCase().includes("api_key_invalid"))
        ) {
             throw new Error("De API sleutel is ongeldig of niet correct geconfigureerd. Controleer de instellingen of neem contact op met de beheerder.");
        }
        // If it's a generic JSON error after the specific API key check, provide more context if raw output is available
        if (error.message.toLowerCase().includes("json") && rawGeminiTextOutput) {
             throw new Error(`Probleem bij het verwerken van het antwoord van de AI. Probeer het opnieuw. Respons (deel): ${rawGeminiTextOutput.substring(0, 300)}...`);
        }
        // Re-throw other specific errors or a generic one
        throw new Error(error.message || "Kon het hardloopschema niet genereren. Controleer de console voor details of probeer het later opnieuw.");
    }
    // Fallback for non-Error objects thrown
    throw new Error("Een onbekende fout is opgetreden bij het genereren van het schema. Probeer het later opnieuw.");
  }
};
