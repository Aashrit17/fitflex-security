import React, { useState } from "react";
import {
  useGetFoods,
  useAddFood,
  useUpdateFood,
  useDeleteFood,
  useUpdateCaloriesConsumed,
} from "./query";

interface FoodItem {
  _id: string; // Assuming MongoDB object ID
  name: string;
  calorie: number;
}

interface FoodIntakeProps {
  userId?: string;
}

const FoodIntake: React.FC<FoodIntakeProps> = ({ userId }) => {
  const [activeTab, setActiveTab] = useState<"intake" | "manage">("intake");

  // Fetch foods (Re-fetches after add, edit, delete)
  const { data: foods, refetch, isLoading, error } = useGetFoods();

  // Log data to verify structure
  console.log(foods); // Check the data structure

  // Safely check if foods is an array
  const safeFoods = Array.isArray(foods) ? foods : [];

  // Food Intake State
  const [selectedFood, setSelectedFood] = useState<string>("");

  // Mutations for logging food intake
  const { mutate: logFoodIntake, isPending: logging } = useUpdateCaloriesConsumed();

  // Manage Food State
  const [foodName, setFoodName] = useState("");
  const [foodCalories, setFoodCalories] = useState("");
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Mutations for managing food
  const { mutate: addFood } = useAddFood();
  const { mutate: updateFood } = useUpdateFood();
  const { mutate: deleteFood } = useDeleteFood();

  /** ✅ Log food intake */
  const handleLogFoodIntake = () => {
    if (!userId || !selectedFood) return;
  
    const selectedFoodItem = safeFoods.find((item: FoodItem) => item.name === selectedFood);
    if (!selectedFoodItem) return;
  
    logFoodIntake(
      { userId, caloriesConsumed: selectedFoodItem.calorie, foodName: selectedFoodItem.name },
      {
        onSuccess: () => {
          console.log("Food intake logged!");
          setSelectedFood(""); // Reset selection
          refetch(); // Refetch the list of foods after logging intake
        },
      }
    );
  };

  /** ✅ Add or update a food item */
  const handleSaveFood = () => {
    if (!foodName || !foodCalories) return;

    const foodData = { name: foodName, calorie: Number(foodCalories) };

    if (editingFood) {
      updateFood(
        { id: editingFood._id, ...foodData },
        { onSuccess: () => refetch() }
      );
    } else {
      addFood(foodData, { onSuccess: () => refetch() });
    }

    setFoodName("");
    setFoodCalories("");
    setEditingFood(null);
  };

  /** ✅ Edit an existing food */
  const handleEditFood = (foodItem: FoodItem) => {
    setFoodName(foodItem.name);
    setFoodCalories(foodItem.calorie.toString());
    setEditingFood(foodItem);
  };

  /** ✅ Delete a food item */
  const handleDeleteFood = (id: string) => {
    deleteFood(id, { onSuccess: () => refetch() });
  };

  // Loading and error handling UI
  if (isLoading) {
    return <div className="text-center text-white">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading foods!</div>;
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full max-w-md mx-auto">
      {/* Tabs Navigation */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          className={`p-3 rounded-lg font-semibold w-1/2 transition ${activeTab === "intake" ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-400"}`}
          onClick={() => setActiveTab("intake")}
        >
          🍽️ Food Intake
        </button>
        <button
          className={`p-3 rounded-lg font-semibold w-1/2 transition ${activeTab === "manage" ? "bg-green-600 text-white" : "bg-gray-800 text-gray-400"}`}
          onClick={() => setActiveTab("manage")}
        >
          🍎 Manage Food
        </button>
      </div>

      {/* Food Intake Tab */}
      {activeTab === "intake" ? (
        <>
          <h2 className="text-xl text-purple-300 font-semibold mb-4 text-center">🍽️ Log Food Intake</h2>

          {/* Select existing food from the list */}
          <select
            value={selectedFood}
            onChange={(e) => setSelectedFood(e.target.value)}
            className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Food</option>
            {safeFoods.length === 0 ? (
              <option>No foods available</option>
            ) : (
              safeFoods.map((item: FoodItem) => (
                <option key={item._id} value={item.name}>
                  {item.name} - {item.calorie} kcal
                </option>
              ))
            )}
          </select>

          <button
            onClick={handleLogFoodIntake}
            className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 transition transform hover:scale-105 active:scale-95 p-3 rounded-lg font-semibold w-full mt-6"
            disabled={logging}
          >
            {logging ? "Logging..." : "Log Intake"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl text-green-300 font-semibold mb-4 text-center">🍎 Manage Food</h2>

          {/* Input fields for adding new foods */}
          <div className="space-y-4">
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Food Name"
              className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              value={foodCalories}
              onChange={(e) => setFoodCalories(e.target.value)}
              placeholder="Calories"
              className="p-3 bg-gray-800 text-white rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button to add/update food item */}
          <button
            onClick={handleSaveFood}
            className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 transition transform hover:scale-105 active:scale-95 p-3 rounded-lg font-semibold w-full mt-6"
          >
            {editingFood ? "Update Food" : "Add Food"}
          </button>

          {/* List of all food items */}
          <ul className="mt-6 text-sm text-gray-300 space-y-3">
            {safeFoods.length === 0 ? (
              <li>No foods available</li>
            ) : (
              safeFoods.map((item: FoodItem) => (
                <li key={item._id} className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md">
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold text-green-300">{item.name}</span>
                    <span className="text-sm text-gray-400">Calories: {item.calorie} kcal</span>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEditFood(item)}
                      className="text-green-500 hover:text-green-600 transition p-2 transform hover:scale-110 active:scale-95"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteFood(item._id)}
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

export default FoodIntake;
