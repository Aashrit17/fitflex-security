import {
  BarChart,
  Bed,
  Bell,
  CrownIcon,
  Droplet,
  Dumbbell,
  Home,
  Lightbulb,
  LogOut,
  Menu,
  Moon,
  Sun,
  Utensils,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/styles.css";
import "../styles/theme.css";
import ExerciseManagement from "./ExcerciseTracker";
import FitnessTips from "./FitnessTips";
import FoodIntake from "./FoodIntake";
import MealSuggestions from "./MealSuggestions";
import Notifications from "./Notifications";
import Pros from "./Pro";
import SleepTracker from "./SleepTracker";
import ProPage from "./Pro";
import UserProfile from "./UserProfile";
import WaterIntakeTracker from "./WaterIntakeTracker";
import ProgressPage from "./progress";
import { ExerciseItem, FoodItem } from "./types";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | undefined>();

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      const parsedUser = JSON.parse(userString);
      if (parsedUser?.id) {
        setUserId(parsedUser.id);
      } else {
        console.warn("User ID missing in parsed user object");
      }
    } else {
      console.warn("No user object found in localStorage");
    }
  }, []);

  const [hoursSlept, setHoursSlept] = useState(8);
  const [waterIntake, setWaterIntake] = useState(1500);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [activeSection, setActiveSection] = useState("Home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const theme = isDarkMode ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [isDarkMode]);

  const menuItems = [
    { name: "Home", icon: Home },
    // { name: "Food Intake", icon: Utensils },
    { name: "Exercise", icon: Dumbbell },
    { name: "Sleep", icon: Bed },
    { name: "Water", icon: Droplet },
    { name: "Progress", icon: BarChart },
    { name: "Tips", icon: Lightbulb },
    { name: "Reminder", icon: Bell },
    { name: "Pro", icon: CrownIcon },

  ];

  const renderContent = () => {
    if (!userId) return <div className="text-red-500">User ID not found</div>;

    switch (activeSection) {
 
      case "Exercise":
        return <ExerciseManagement userId={userId} />;
      case "Pro":
        return <ProPage userId={userId} />;
      case "Sleep":
        return <SleepTracker hoursSlept={hoursSlept} setHoursSlept={setHoursSlept} />;
      case "Water":
        return <WaterIntakeTracker waterIntake={waterIntake} setWaterIntake={setWaterIntake} />;
      case "Progress":
        return <ProgressPage userId={userId} />;
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
        return null;
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-64"
          } transition-transform lg:translate-x-0 shadow-xl flex flex-col justify-between`}
      >
        <div>
          <div className="p-4 flex justify-between items-center border-b border-gray-700">
            <h2 className="text-xl font-bold tracking-wide">Fitness Dashboard</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-300 hover:text-white">
              <X size={24} />
            </button>
          </div>

          <nav className="mt-4 space-y-1">
            {menuItems.map(({ name, icon: Icon }) => (
              <button
                key={name}
                onClick={() => {
                  setActiveSection(name);
                  setIsSidebarOpen(false);
                }}
                className={`flex items-center px-5 py-4 w-full text-left rounded-lg transition-all transform ${activeSection === name ? "bg-purple-600 scale-105 shadow-md" : "hover:bg-gray-700 hover:scale-105"
                  }`}
              >
                <Icon className="mr-3 w-5 h-5" />
                {name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/");
            }}
            className="w-full flex items-center justify-center px-4 py-3 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all shadow-lg"
          >
            <LogOut className="mr-2 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-0 lg:ml-64 bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-gray-700 dark:text-gray-300">
            <Menu size={24} />
          </button>
          <h1 className="text-3xl font-bold">{activeSection}</h1>
          <button
            onClick={toggleDarkMode}
            className="px-4 py-2 rounded-lg flex items-center bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {isDarkMode ? <Sun className="mr-2 w-5 h-5" /> : <Moon className="mr-2 w-5 h-5" />}
            {isDarkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {activeSection === "Home" && (
          <div className="mb-6 animate-fade-in">
            <UserProfile />
          </div>
        )}

        <div className="animate-fade-in">{renderContent()}</div>
      </main>
    </div>
  );
};

export default Dashboard;
