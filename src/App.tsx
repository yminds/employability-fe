// # Packages
import React from "react";

// # CSS / Images
import "./App.css";

// # Components
import AppRoutes from "./Routes.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMetaTags } from "./hooks/useMetaTags.tsx";

// # Utils / Slices / Hooks

const App: React.FC = () => {
  useMetaTags();
  return (
    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || " "}>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </GoogleOAuthProvider>
  );
};

export default App;
