import React, { useEffect } from "react";
import { useGetUserProgress } from "./query";
import { useNavigate } from "react-router-dom";

interface ProgressDataEntry {
  exerciseName: string;
  exerciseMinutes: number;
  caloriesBurned: number;
  timestamp: string;
}

interface ExerciseItem {
  name: string;
  caloriesBurnedPerMinute: number;
  _id: string;
}

interface ProgressResponse {
  progress_data: ProgressDataEntry[];
  exercise_items?: ExerciseItem[];
  last_updated?: string;
}

interface ProgressPageProps {
  userId: string;
}

const ProgressPage: React.FC<ProgressPageProps> = ({ userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) navigate("/");
  }, [userId, navigate]);

  const { data, isLoading, isError } = useGetUserProgress(userId);

  if (!userId) return <div className="text-center text-red-500 mt-10">User ID not found</div>;
  if (isLoading) return <div className="text-white text-center mt-10">Loading...</div>;
  if (isError || !data?.data) return <div className="text-red-500 text-center mt-10">Error loading progress</div>;

  const progress: ProgressResponse = data.data;
  const reversedData = [...(progress.progress_data || [])].reverse();

  return (
    <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg shadow-xl p-8">
      <h1 className="text-4xl font-semibold text-center mb-8">📈 Exercise Progress</h1>
      <div className="bg-gray-900 shadow-lg rounded-lg p-6">
        {reversedData.length > 0 ? (
          reversedData.map((entry, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-lg p-6 mb-4 border border-gray-700 hover:border-purple-400 transition-all"
            >
              <p className="font-medium text-lg text-purple-200">
                📅 {new Date(entry.timestamp).toLocaleDateString()}
              </p>
              <p className="text-sm mt-2 text-gray-300">
                🏋️ {entry.exerciseName} — {entry.exerciseMinutes} min
              </p>
              <p className="text-sm text-gray-300">
                🔥 Calories Burned: <span className="text-white">{entry.caloriesBurned} kcal</span>
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-300">No exercise progress recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
      