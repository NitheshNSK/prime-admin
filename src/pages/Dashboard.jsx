import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { getDashboardSummary } from "../api/api";
import { Gem, CheckCircle, UtensilsCrossed, LogOut } from "lucide-react"; // Lucide icons

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({
    marbleCount: 0,
    completedCount: 0,
    kitchenCount: 0,
  });

  useEffect(() => {
    fetchSummary();
  }, []);

  const fetchSummary = async () => {
    const data = await getDashboardSummary();
    setSummary(data);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-5xl mx-auto">
       
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Total Marbles */}
          <div className="bg-white border rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <Gem className="text-blue-600" size={28} />
            </div>
            <p className="text-gray-500 text-sm mb-1">Total Marbles</p>
            <p className="text-4xl font-bold text-blue-600">
              {summary.marbleCount}
            </p>
          </div>

          {/* Completed Projects */}
          <div className="bg-white border rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle className="text-green-600" size={28} />
            </div>
            <p className="text-gray-500 text-sm mb-1">Completed Projects</p>
            <p className="text-4xl font-bold text-green-600">
              {summary.completedCount}
            </p>
          </div>

          {/* Kitchen Projects */}
          <div className="bg-white border rounded-lg shadow-md p-6 text-center">
            <div className="flex justify-center mb-2">
              <UtensilsCrossed className="text-purple-600" size={28} />
            </div>
            <p className="text-gray-500 text-sm mb-1">Kitchen Projects</p>
            <p className="text-4xl font-bold text-purple-600">
              {summary.kitchenCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
