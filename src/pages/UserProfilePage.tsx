import UserProfile from "@/features/profile/UserProfile";

const UserProfilePage: React.FC = () => {
  return (
    <div
      className="flex justify-center overflow-x-auto overflow-y-auto "
      style={{ scrollbarWidth: "none" }}
    >
      <main className="w-[95%] h-screen flex bg-[#F5F5F5] justify-center p-5 max-w-[1800px]  ">
        <UserProfile />
      </main>
    </div>
  );
};

export default UserProfilePage;
