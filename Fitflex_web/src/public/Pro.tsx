import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface ProPageProps {
  userId: string;
}

const ProPage: React.FC<ProPageProps> = ({ userId }) => {
  const navigate = useNavigate();
  const [isPro, setIsPro] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await axios.get(`https://localhost:3001/api/v1/auth/${userId}`);
        setIsPro(response.data.pro);
      } catch (err) {
        console.error("❌ Failed to fetch user:", err);
        alert("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchUserStatus();
  }, [userId]);

  const handleSubscribe = async () => {
    try {
      const response = await axios.post("https://localhost:3001/api/khalti/initiate", {
        userId,
      });

      const { payment_url } = response.data;
      window.location.href = payment_url;
    } catch (error) {
      console.error("❌ Error initiating Khalti payment:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-lg text-gray-600">Checking subscription status...</div>;
  }

  if (isPro) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-3xl font-bold text-green-600 mb-4">🎉 You're already a Pro!</h2>
        <p className="text-lg">Enjoy all the advanced features and insights in your dashboard.</p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-8 rounded-lg shadow-lg max-w-xl mx-auto mt-10">
      <h2 className="text-3xl font-bold mb-4 text-center">🌟 Unlock Pro Features</h2>

      <ul className="list-disc pl-6 text-lg space-y-2 mb-6">
        <li>Advanced analytics and visualizations</li>
        <li>Priority tips and custom reminders</li>
        <li>Export your progress as reports</li>
        <li>Personalized meal and workout plans</li>
      </ul>

      <div className="text-center">
        <button
          onClick={handleSubscribe}
          className="bg-white text-yellow-600 font-semibold py-3 px-6 rounded-full hover:bg-yellow-100 transition shadow-md"
        >
          Subscribe Now – Rs. 200
        </button>
      </div>
    </div>
  );
};

export default ProPage;
