import React, { useEffect, useState } from 'react';
import { useGetUserProgress } from './query'; // Import the query to fetch progress data

interface ProgressTrackerProps {
  userId: string;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ userId }) => {
  const [totalCalories, setTotalCalories] = useState<number>(0);
  const [caloriesBurned, setCaloriesBurned] = useState<number>(0);
  const [goal, setGoal] = useState<number>(0);

  const { data, isLoading, error } = useGetUserProgress(userId);

  useEffect(() => {
    if (data) {
      // Make sure to access the response's `data` property
      const { totalCalories, caloriesBurned, goal } = data.data; // `data.data` contains the actual response data
      setTotalCalories(totalCalories);
      setCaloriesBurned(caloriesBurned);
      setGoal(goal);
    }
  }, [data]);

  const progress = Math.min((totalCalories - caloriesBurned) / goal, 1) * 100;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching progress data.</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl text-purple-300 font-semibold mb-4">📊 Your Progress</h2>
      <p className="text-sm mb-2">🔥 Calories Consumed: <span className="font-bold">{totalCalories} kcal</span></p>
      <p className="text-sm mb-2">💪 Calories Burned: <span className="font-bold">{caloriesBurned} kcal</span></p>
      <p className="text-sm mb-2">🎯 Goal: <span className="font-bold">{goal} kcal</span></p>
      <div className="w-full bg-gray-700 h-5 rounded-full overflow-hidden mt-3">
        <div className="bg-gradient-to-r from-purple-500 to-purple-700 h-full transition-all" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  );
};

export default ProgressTracker;
