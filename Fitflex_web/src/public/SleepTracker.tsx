import React, { useState, useEffect } from "react";
import { useUpdateSleep } from "./query"; 

interface SleepTrackerProps {
  hoursSlept: number;
  setHoursSlept: React.Dispatch<React.SetStateAction<number>>;
  userId?: string; 
}

const SleepTracker: React.FC<SleepTrackerProps> = ({ hoursSlept, setHoursSlept, userId }) => {
  const { mutate: updateSleep, isPending, isError } = useUpdateSleep(); 

  const [storedUserId, setStoredUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      const idFromStorage = localStorage.getItem("userId");
      setStoredUserId(idFromStorage);
    }
  }, [userId]);

  const finalUserId = userId || storedUserId; 
  const updateSleepHours = () => {
    if (!finalUserId) {
      console.error("User ID is missing!");
      return;
    }

    updateSleep(
      { userId: finalUserId, sleepHours: hoursSlept },
      {
        onSuccess: () => {
          console.log("Sleep data updated successfully!");
        },
      }
    );
  };

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full">
      <h2 className="text-xl text-purple-300 font-semibold mb-4">😴 Sleep Tracker</h2>
      <input
        type="number"
        value={hoursSlept}
        onChange={(e) => setHoursSlept(Number(e.target.value))}
        placeholder="Hours of Sleep"
        className="p-3 bg-gray-800 text-white rounded-lg w-full mb-2"
      />
      <button
        onClick={updateSleepHours}
        className="bg-purple-500 hover:bg-purple-600 transition p-3 rounded-lg font-bold w-full mt-4"
        disabled={isPending}
      >
        {isPending ? "Updating..." : "Update Sleep"}
      </button>
      {isError && <p className="text-red-500 text-sm mt-2">⚠️ Failed to update sleep data!</p>}
      <p className="text-sm text-gray-300 mt-4">You slept for {hoursSlept} hours today.</p>
    </div>
  );
};

export default SleepTracker;
