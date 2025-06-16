export const RunningLevel = {
  BEGINNER: "beginner",
  INTERMEDIATE: "gemiddeld",
  ADVANCED: "gevorderd",
};

export const RaceDistance = {
  FIVE_K: "5 km",
  TEN_K: "10 km",
  HALF_MARATHON: "Halve Marathon",
  MARATHON: "Marathon",
};

// The following JSDoc comments describe the shape of data returned by the AI API.
/**
 * @typedef {Object} Workout
 * @property {string} day
 * @property {string} workoutType
 * @property {string} [duration]
 * @property {string} [distance]
 * @property {string} [intensity]
 * @property {string} description
 */

/**
 * @typedef {Object} WeeklySchedule
 * @property {number} week
 * @property {string} summary
 * @property {Workout[]} days
 */

/**
 * @typedef {Object} TrainingProgram
 * @property {string} programTitle
 * @property {number} totalWeeks
 * @property {WeeklySchedule[]} weeklySchedule
 */
