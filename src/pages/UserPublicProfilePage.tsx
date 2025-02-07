import PublicProfile from "@/features/profile/PublicProfile";

const UserPublicProfilePage: React.FC = () => {
  return (
    <div
      className="flex justify-center overflow-x-auto overflow-y-auto "
      style={{ scrollbarWidth: "none" }}
    >
      <main className="w-full h-full flex bg-[#F5F5F5] justify-center p-5 max-w-[1800px]  ">
        <PublicProfile />
      </main>
    </div>
  );
};

export default UserPublicProfilePage;
