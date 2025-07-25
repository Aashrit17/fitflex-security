import { BarChart, Bed, Bell, Droplet, Dumbbell, Home, Lightbulb, LogOut, Menu, Moon, Sun, Utensils, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "../styles/styles.css";
import "../styles/theme.css";
import ExerciseTracker from "./ExcerciseTracker";
import FitnessTips from "./FitnessTips";
import FoodIntake from "./FoodIntake";
import MealSuggestions from "./MealSuggestions";
import Notifications from "./Notifications";
import ProgressTracker from "./ProgressTracker";
import SleepTracker from "./SleepTracker";
import UserProfile from "./UserProfile";
import WaterIntakeTracker from "./WaterIntakeTracker";
import ProgressPage from "./progress";  // Import ProgressPage
import { ExerciseItem, FoodItem } from "./types";

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Initialize navigation
  
  // Ensure userId is either undefined or string, not null
  const userId = localStorage.getItem("userId") ?? undefined;
  if (!userId) {
    navigate("/"); // Redirect to login if userId is not found
  }

  // Maintain state for each section
  const [food, setFood] = useState<FoodItem[]>([]); // Food state (for managing the food intake)
  const [exercise, setExercise] = useState<ExerciseItem[]>([]); // Exercise state
  const [goal, setGoal] = useState(2000); // Goal state
  const [hoursSlept, setHoursSlept] = useState(8); // Sleep state
  const [waterIntake, setWaterIntake] = useState(1500); // Water intake state
  const [name, setName] = useState("John Doe");
  const [avatarUrl, setAvatarUrl] = useState("https://via.placeholder.com/150");
  const [phone, setPhone] = useState("123-456-7890");
  const [email, setEmail] = useState("johndoe@example.com");

  // Theme Toggle
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  // Sidebar Navigation State
  const [activeSection, setActiveSection] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Sidebar menu items with icons
  const menuItems = [
    { name: "Home", icon: Home },
    { name: "Food Intake", icon: Utensils },
    { name: "Exercise", icon: Dumbbell },
    { name: "Sleep", icon: Bed },
    { name: "Water", icon: Droplet },
    { name: "Progress", icon: BarChart },
    { name: "Tips", icon: Lightbulb },
    { name: "Reminder", icon: Bell },
  ];

  // Dynamic content rendering
  const renderContent = () => {
    switch (activeSection) {
      case "Food Intake":
        return <FoodIntake userId={userId} />;  // Pass userId to FoodIntake
      case "Exercise":
        return <ExerciseTracker userId={userId}/>;
      case "Sleep":
        return <SleepTracker hoursSlept={hoursSlept} setHoursSlept={setHoursSlept} />;
      case "Water":
        return <WaterIntakeTracker waterIntake={waterIntake} setWaterIntake={setWaterIntake} />;
      case "Progress":
        return <ProgressPage />;  // Integrate ProgressPage here
      case "Tips":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
            <MealSuggestions />
            <FitnessTips />
          </div>
        );
      case "Reminder":
        return <Notifications />;
      default:
        return;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform lg:translate-x-0 shadow-xl flex flex-col justify-between`}>
        <div>
          {/* Sidebar Header */}
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-bold tracking-wide">Fitness Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          {/* Sidebar Menu */}
          <nav className="mt-4 space-y-1">
            {menuItems.map(({ name, icon: Icon }) => (
              <button key={name}
                onClick={() => { setActiveSection(name); setIsSidebarOpen(false); }}
                className={`flex items-center px-5 py-4 w-full text-left rounded-lg transition-all transform ${activeSection === name ? "bg-purple-600 scale-105 shadow-md" : "hover:bg-gray-700 hover:scale-105"}`}>
                <Icon className="mr-3 w-5 h-5" />
                {name}
              </button>
            ))}
          </nav>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("userId"); // Clear userId on logout
              localStorage.removeItem("token"); // Clear token
              localStorage.removeItem("user"); // Clear user details
              navigate("/");
            }}
            className="w-full flex items-center justify-center px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg">
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 lg:ml-64 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-700 dark:text-gray-300">
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold">{activeSection}</h1>
          <button onClick={toggleDarkMode} className="px-4 py-2 rounded-lg flex items-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
            {isDarkMode ? <Sun className="mr-2 w-5 h-5" /> : <Moon className="mr-2 w-5 h-5" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* User Profile Section */}
        {activeSection === "Home" && (
          <div className="mb-6 animate-fade-in">
            <UserProfile
              // name={name} avatarUrl={avatarUrl} phone={phone} email={email}
              // setName={setName} setAvatarUrl={setAvatarUrl} setPhone={setPhone} setEmail={setEmail}
              // setGoal={setGoal}
              // goal={goal} hoursSlept={hoursSlept} waterIntake={waterIntake} workoutMinutes={0}
            />
          </div>
        )}

        {/* Render Selected Content */}
        <div className="animate-fade-in">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
