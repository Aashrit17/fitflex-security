import React, { useState } from "react";

import {
  useGetItemExercises,
  useAddExerciseItem,
  useUpdateExerciseItem,
  useDeleteExerciseItem,
  useUpdateExercise,
} from "./query";

interface ExerciseItem {
  _id: string;
  name: string;
  caloriesBurnedPerMinute: number;
}

interface ExerciseProps {
  userId?: string;
}

const ExerciseManagement: React.FC<ExerciseProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"log" | "manage">("log");

  // Fetch exercises (Re-fetches after add, edit, delete)
  const { data: exercises, refetch, isLoading, error } = useGetItemExercises();

  // Safely check if exercises is an array
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  // Exercise Logging State
  const [selectedExercise, setSelectedExercise] = useState<string>("");
  const [exerciseMinutes, setExerciseMinutes] = useState<number>(0);

  // Mutations for logging exercises
  const { mutate: logExercise, isPending: loggingExercise } = useUpdateExercise();

  // Manage Exercise State
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseCaloriesPerMinute, setExerciseCaloriesPerMinute] = useState<number | string>("");

  const [editingExercise, setEditingExercise] = useState<ExerciseItem | null>(null);

  // Mutations for adding, updating, and deleting exercises
  const { mutate: addExerciseItem } = useAddExerciseItem();
  const { mutate: updateExerciseItem } = useUpdateExerciseItem();
  const { mutate: deleteExerciseItem } = useDeleteExerciseItem();

  /** ✅ Log exercise */
  const handleLogExercise = () => {
    console.log("📌 handleLogExercise triggered"); // Debugging log
  
    if (!userId || !selectedExercise || exerciseMinutes <= 0) {
      console.warn("⚠️ Missing required fields:", { userId, selectedExercise, exerciseMinutes });
      return;
    }
  
    const selectedExerciseItem = safeExercises.find((item) => item.name === selectedExercise);
    if (!selectedExerciseItem) {
      console.warn("⚠️ Selected exercise not found in list:", selectedExercise);
      return;
    }
  
    const caloriesBurned = selectedExerciseItem.caloriesBurnedPerMinute * exerciseMinutes;
    console.log("🔥 Logging Exercise:", { userId, selectedExercise, exerciseMinutes, caloriesBurned });
  
    logExercise(
      { userId , exerciseMinutes, exerciseName: selectedExercise, caloriesBurned },
      {
        onSuccess: (response) => {
          console.log("✅ Exercise logged successfully!", response);
          setSelectedExercise("");
          setExerciseMinutes(0);
        },
        onError: (error) => {
          console.error("❌ Error logging exercise:", error);
        },
      }
    );
  };
  

  /** ✅ Add or update exercise */
  const handleSaveExercise = () => {
    if (!exerciseName || !exerciseCaloriesPerMinute) return;

    const exerciseData = {
      name: exerciseName,
      caloriesBurnedPerMinute: Number(exerciseCaloriesPerMinute),
    };

    if (editingExercise) {
      updateExerciseItem(
        { id: editingExercise._id, ...exerciseData },
        { onSuccess: () => refetch() }
      );
    } else {
      addExerciseItem(exerciseData, { onSuccess: () => refetch() });
    }

    setExerciseName("");
    setExerciseCaloriesPerMinute("");
    setEditingExercise(null);
  };

  /** ✅ Edit an existing exercise */
  const handleEditExercise = (exercise: ExerciseItem) => {
    setExerciseName(exercise.name);
    setExerciseCaloriesPerMinute(exercise.caloriesBurnedPerMinute.toString());
    setEditingExercise(exercise);
  };

  /** ✅ Delete an exercise */
  const handleDeleteExercise = (id: string) => {
    deleteExerciseItem(id, { onSuccess: () => refetch() });
  };

  // Loading and error handling UI
  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading exercises!</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      {/* Tabs Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`p-3 rounded-lg font-semibold w-1/2 transition ${
            activeTab === "log" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("log")}
        >
          🏋️‍♂️ Log Exercise
        </button>
        <button
          className={`p-3 rounded-lg font-semibold w-1/2 transition ${
            activeTab === "manage" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"
          }`}
          onClick={() => setActiveTab("manage")}
        >
          🛠️ Manage Exercises
        </button>
      </div>

      {/* Exercise Logging Tab */}
      {activeTab === "log" ? (
        <>
          <h2 className="text-xl text-purple-300 font-semibold mb-4 text-center">🏋️‍♂️ Log Exercise</h2>

          {/* Select existing exercise from the list */}
          <select
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Exercise</option>
            {safeExercises.length === 0 ? (
              <option>No exercises available</option>
            ) : (
              safeExercises.map((item) => (
                <option key={item._id} value={item.name}>
                  {item.name} - {item.caloriesBurnedPerMinute} kcal/min
                </option>
              ))
            )}
          </select>

          {/* Input for exercise duration */}
          <input
            type="number"
            value={exerciseMinutes}
            onChange={(e) => setExerciseMinutes(Number(e.target.value))}
            placeholder="Exercise Minutes"
            className="p-3 bg-gray-800 text-white rounded-lg w-full mt-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleLogExercise}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition transform hover:scale-105 active:scale-95 p-3 rounded-lg font-semibold w-full mt-6"
            disabled={loggingExercise}
          >
            {loggingExercise ? "Logging..." : "Log Exercise"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl text-green-300 font-semibold mb-4 text-center">🛠️ Manage Exercises</h2>

          {/* Input fields for adding new exercise */}
          <div className="space-y-4">
            <input
              type="text"
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              placeholder="Exercise Name"
              className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={exerciseCaloriesPerMinute}
              onChange={(e) => setExerciseCaloriesPerMinute(e.target.value)}
              placeholder="Calories Burned Per Minute"
              className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button to add/update exercise item */}
          <button
            onClick={handleSaveExercise}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition transform hover:scale-105 active:scale-95 p-3 rounded-lg font-semibold w-full mt-6"
          >
            {editingExercise ? "Update Exercise" : "Add Exercise"}
          </button>

          {/* List of all exercise items */}
          <ul className="mt-6 text-sm text-gray-300 space-y-3">
            {safeExercises.length === 0 ? (
              <li>No exercises available</li>
            ) : (
              safeExercises.map((item) => (
                <li key={item._id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-green-300">{item.name}</span>
                    <span className="text-sm text-gray-400">Burns {item.caloriesBurnedPerMinute} kcal/min</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditExercise(item)}
                      className="text-green-500 hover:text-green-600 transition p-2 transform hover:scale-110 active:scale-95"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteExercise(item._id)}
                      className="text-red-500 hover:text-red-600 transition p-2 transform hover:scale-110 active:scale-95"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default ExerciseManagement;
