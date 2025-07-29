const MealSuggestions: React.FC = () => {
    const suggestions = [
      { name: "Grilled Chicken Salad", calories: 300 },
      { name: "Vegan Burrito", calories: 400 },
      { name: "Protein Smoothie", calories: 250 },
    ];
  
    return (
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg w-full">
        <h2 className="text-xl text-purple-300 font-semibold mb-4">🍴 Meal Suggestions</h2>
        <ul className="text-sm text-gray-300">
          {suggestions.map((meal, index) => (
            <li key={index} className="flex justify-between mb-2">
              <span>{meal.name}</span>
              <span>{meal.calories} kcal</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default MealSuggestions;
  