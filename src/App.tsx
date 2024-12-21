import React from "react";
import { Routes, Route } from "react-router-dom";
import LoginSignupForm from "./pages/LoginSignupForm.tsx";
import CompleteProfile from "./pages/CompleteProfile.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Homepage from "./pages/Homepage.tsx";
import VerifyPhoneNumber from "./components/inputs/VerifyPhoneNumber.tsx";
import AddPhoneNumber from "./pages/AddPhoneNumber.tsx";
// import { fetchUser } from "./store/slices/authSlice.ts";
// import "@fontsource/ubuntu";
// import { useDispatch, useSelector } from "react-redux";
// import { useFetchUserQuery } from "./store/slices/authSlice.ts";
import InterviewPage from "./pages/Interview.tsx";
import InterviewSetup from "./pages/SetupScreen.tsx";
import "./App.css";

const App: React.FC = () => {
  // const { data: user, isLoading, error } = useFetchUserQuery();
  // const dispatch = useDispatch();
  // const { status, isAuthenticated } = useSelector((state: any) => state.auth);

  // React.useEffect(() => {
  //   if (!isAuthenticated && status === "idle") {
  //     dispatch(fetchUser());
  //   }
  // }, [dispatch, isAuthenticated, status]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Homepage />} />
      <Route path="/:role/register" element={<LoginSignupForm />} />
      {/* <Route path="/verify-phone" element={<OTPVerification />} /> */}
      <Route path="/verify-otp" element={<VerifyPhoneNumber />} />
      {/* <Route path="/interview/:id?" element={<InterviewPage />} /> */}
      <Route path="/interview" element={<InterviewSetup/>} />
      <Route path="/verify-phone" element={<AddPhoneNumber />} />

      {/* <Route path="/complete-profile" element={<CompleteProfile />} /> */}

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
