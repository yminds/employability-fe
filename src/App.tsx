// # Packages
import React from "react";

// # CSS / Images
import "./App.css";

// # Components
import AppRoutes from "./Routes.tsx";
import MainLayout from "./layout/MainLayout.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { HelmetProvider } from "react-helmet-async";
import { DefaultMetaTags } from "./common/DefaultMetaTags.tsx";

// # Utils / Slices / Hooks

const App: React.FC = () => {
  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID || " "}>
        <MainLayout>
          <DefaultMetaTags />
          <AppRoutes />
        </MainLayout>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
};

export default App;
