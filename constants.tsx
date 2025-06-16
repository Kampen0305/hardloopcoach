import React from 'react';
import { RaceDistance } from './types';

export const APP_TITLE = "Hardloopschema Generator";
export const GEMINI_MODEL_TEXT = "gemini-2.5-flash-preview-04-17"; // Confirmed use of allowed model

export const WEEKS_PER_DISTANCE: Record<RaceDistance, number> = {
  [RaceDistance.FIVE_K]: 8,
  [RaceDistance.TEN_K]: 10,
  [RaceDistance.HALF_MARATHON]: 12,
  [RaceDistance.MARATHON]: 16,
};

// StravaIcon is defined as a component.
// Changed from const arrow function to regular function declaration.
export function StravaIcon(): React.ReactNode {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.388 13.1L12.74 7.788L10.092 13.1H7.014L11.376 3.8H14.076L18.438 13.1H15.388ZM9.08 14.232L7.3 17.658L6.408 15.864L4.224 21H1.5L6.156 12.012L9.08 14.232ZM17.616 14.94L16.296 17.658L15.024 14.94L11.964 21H14.736L16.296 17.928L17.856 21H20.628L17.616 14.94Z" />
    </svg>
  );
}

// This file is intentionally structured this way.
// It was previously mentioned to be empty due to a potential syntax error,
// but it correctly contains constants and the StravaIcon component.