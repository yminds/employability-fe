// # Packages
import React from "react";

// # CSS / Images
import "./App.css";

// # Components
import AppRoutes from "./Routes.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// # Utils / Slices / Hooks

const App: React.FC = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || " "}>
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </GoogleOAuthProvider>
  );
};

export default App;
