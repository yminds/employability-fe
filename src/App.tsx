// # Packages
import React from "react";

// # CSS / Images
import "./App.css";

// # Components
import AppRoutes from "./Routes.tsx";
import MainLayout from "./layout/MainLayout.tsx";

// # Utils / Slices / Hooks

const App: React.FC = () => {
  return (
    <MainLayout>
      <AppRoutes />
    </MainLayout>
  );
};

export default App;

