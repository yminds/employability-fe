import UserProfile from "@/features/profile/UserProfile";

import React from "react";

const UserProfilePage: React.FC = () => {

  return (
    <div className="flex justify-center">
      {/* <main className="w-screen h-screen flex bg-[#F5F5F5] justify-center pt-[50px] pr-[32px] "> */}
        <UserProfile/>
      {/* </main> */}
    </div>
  );
};

export default UserProfilePage;
