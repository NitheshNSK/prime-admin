import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MarblesPage from "./pages/MarblesPage";
import CompletedProjects from "./pages/CompletedProjects";
import KitchenProjects from "./pages/KitchenProjects";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import Navbar from "./components/Navbar";

const PrivateRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

function LayoutWithNavbar({ children }) {
  const { token } = useAuth();
  return (
    <>
      {token && <Navbar />}
      <main>{children}</main>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <LayoutWithNavbar>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/marbles"
              element={
                <PrivateRoute>
                  <MarblesPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/completed-projects"
              element={
                <PrivateRoute>
                  <CompletedProjects />
                </PrivateRoute>
              }
            />
            <Route
              path="/kitchen-projects"
              element={
                <PrivateRoute>
                  <KitchenProjects />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </LayoutWithNavbar>
      </Router>
    </AuthProvider>
  );
}
