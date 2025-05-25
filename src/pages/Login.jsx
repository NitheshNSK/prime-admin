import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin, verifyOtp } from "../api/api";
import { useAuth } from "../auth/AuthContext";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await loginAdmin(email, password);
      setSessionId(res.data.sessionId); // Session ID returned from login
      setShowOtpModal(true); // Show OTP input modal
    } catch (err) {
      setError(err.response?.data?.msg || "Login failed");
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const res = await verifyOtp({ sessionId, otp });
      login(res.data.token); // Save token in context
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen w-[100vw] flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-md sm:mx-auto">
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Admin Login
        </h2>

        {error && (
          <div className="mb-4 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full px-4 py-2 pr-10 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-black-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900 transition-colors"
          >
            Login
          </button>
        </form>
      </div>

      {/* OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
            <h3 className="text-xl font-semibold text-black mb-4">Enter OTP</h3>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 border px-4 py-2 rounded-md text-black"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 bg-gray-200 text-white rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleOtpSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md"
              >
                Verify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
