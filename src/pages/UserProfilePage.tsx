import UserProfile from "@/features/profile/UserProfile";


const UserProfilePage: React.FC = () => {

  return <div className="flex justify-center overflow-x-auto overflow-y-auto " style={{scrollbarWidth:"none"}}>
    <main className="w-screen h-screen flex bg-[#F5F5F5] justify-center pt-[50px] pr-[32px]  ">
      <UserProfile />
    </main>
  </div>;
};

export default UserProfilePage;
