// Define types for food and exercise
export type FoodItem = {
    name: string;
    calories: number;
  };
  
  export type ExerciseItem = {
    name: string;
    duration: number; // Duration in minutes
    caloriesBurned: number; // Calories burned during the exercise
  };
  
  export type Progress = {
    totalCalories: number;
    caloriesBurned: number;
    goal: number;
  };
  