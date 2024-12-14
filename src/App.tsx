import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
import OTPVerification from "./pages/OTPVerification";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { useDispatch, useSelector } from "react-redux";
// import { fetchUser } from "./store/slices/authSlice.ts";
import Homepage from "./pages/Homepage.tsx";
import "@fontsource/ubuntu";
import VerifyPhoneNumber from "./components/inputs/VerifyPhoneNumber.tsx";
import { useFetchUserQuery } from "./store/slices/authSlice.ts";

const App: React.FC = () => {
  const { data: user, isLoading, error } = useFetchUserQuery();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/:role/register" element={<LoginSignupForm />} />
      <Route path="/verify-phone" element={<OTPVerification />} />
      <Route path="/verify-otp" element={<VerifyPhoneNumber />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* Protected Routes */}
      {/* <Route
        path="/complete-profile"
        element={
          // <ProtectedRoute>
          <CompleteProfile />
          // </ProtectedRoute>
        }
      /> */}
    </Routes>
  );
};

export default App;
