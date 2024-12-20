import React from "react";

const Dashboard: React.FC = () => {
  return (
    <>
      <div>Dashboard</div>
      <div
        onClick={() => {
          localStorage.clear();
          window.location.href = "/login";
        }}
      >
        Logout
      </div>
    </>
  );
};

export default Dashboard;
