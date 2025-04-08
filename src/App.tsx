// # Packages
import React from "react";
import { HelmetProvider  } from "react-helmet-async";

// # CSS / Images
import "./App.css";

// # Components
import AppRoutes from "./Routes.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

// # Utils / Slices / Hooks

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || " "}>
        <MainLayout>
          <AppRoutes />
        </MainLayout>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
};

export default App;
