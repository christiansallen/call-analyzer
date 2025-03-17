import "./App.css";
import { useClerkUser } from "./hooks/useClerkUser";
import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { SignIn, SignUp } from "@clerk/clerk-react";
import { NavBar } from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Calls from "./pages/Calls";

console.log("import.meta.env", import.meta.env);

function App() {
  useClerkUser();

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/sign-in"
          element={
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <SignIn />
            </div>
          }
        />
        <Route
          path="/sign-up"
          element={
            <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
              <SignUp />
            </div>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calls"
          element={
            <ProtectedRoute>
              <Calls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
