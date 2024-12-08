import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
import OTPVerification from "./pages/OTPVerification";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./store/slices/authSlice.ts";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { status, isAuthenticated } = useSelector((state: any) => state.auth);

  React.useEffect(() => {
    if (!isAuthenticated && status === "idle") {
      dispatch(fetchUser());
    }
  }, [dispatch, isAuthenticated, status]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginSignupForm />} />
      <Route path="/verify-phone" element={<OTPVerification />} />

      {/* Protected Routes */}
      <Route
        path="/complete-profile"
        element={
          <ProtectedRoute>
            <CompleteProfile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;
