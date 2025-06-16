
export enum RunningLevel {
  BEGINNER = "beginner",
  INTERMEDIATE = "gemiddeld",
  ADVANCED = "gevorderd",
}

export enum RaceDistance {
  FIVE_K = "5 km",
  TEN_K = "10 km",
  HALF_MARATHON = "Halve Marathon",
  MARATHON = "Marathon",
}

export interface Workout {
  day: string; // e.g., "Maandag", "Dinsdag"
  workoutType: string; // e.g., "Duurloop", "Interval", "Rust"
  duration?: string; // e.g., "30 minuten", "1 uur"
  distance?: string; // e.g., "5 km"
  intensity?: string; // e.g., "Rustig tempo", "Wedstrijdtempo"
  description: string; // Detailed explanation
}

export interface WeeklySchedule {
  week: number;
  summary: string;
  days: Workout[];
}

export interface TrainingProgram {
  programTitle: string;
  totalWeeks: number;
  weeklySchedule: WeeklySchedule[];
}

// For Gemini API response structure
export interface GeminiTrainingProgramResponse extends TrainingProgram {}

export interface GroundingChunkWeb {
  uri: string;
  title: string;
}

export interface GroundingChunk {
  web?: GroundingChunkWeb;
  // Other types of chunks can be added here if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // Other grounding metadata fields can be added
}
    