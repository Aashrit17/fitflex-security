import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import DashboardView from "./public/home";
import LoginView from "./public/login";
import ProgressPage from "./public/progress";
import RegistrationView from "./public/registration";
import OTPPage from "./public/OTPPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // 🔁 Make sure this is imported
import ResetPasswordPage from "./public/reset";
import ProsPage from "./public/progress";
import ProtectedRoute from "./public/ProtectedRoute";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Define all routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginView />,
  },
  {
    path: "/register",
    element: <RegistrationView />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardView />
      </ProtectedRoute>
    ),
  },
  {
    path: "/progress",
    element: (
      <ProtectedRoute>
        <ProgressPage userId={""} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/pro",
    element: (
      <ProtectedRoute>
        <ProsPage userId={""} />
      </ProtectedRoute>
    ),
  },
  {
    path: "/verify-otp",
    element: <OTPPage />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPasswordPage />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
