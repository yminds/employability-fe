import type React from "react";
import PublicProfile from "@/features/profile/PublicProfile";

const UserPublicProfilePage: React.FC = () => {
  return (
    <div
      className="flex justify-center overflow-x-auto overflow-y-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <main className="w-full h-full flex bg-[#F5F5F5] justify-center max-w-[1400px]">
        <PublicProfile />
      </main>
    </div>
  );
};

export default UserPublicProfilePage;
