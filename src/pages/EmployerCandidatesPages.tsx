import type React from "react";
import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import { useGetAllCandidatesQuery } from "@/api/employerJobsApiSlice";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowUpDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// If you have a back arrow icon
import arrow from "@/assets/skills/arrow.svg"; // adjust path to your arrow image

interface Skill {
  _id: string;
  verified_rating: number;
  name?: string; // Optional since it might not be in the actual data
}

interface ICandidate {
  _id: string;
  name: string;
  username: string;
  email: string;
  profile_image?: string; // Profile image URL
  avatar?: string; // Alternative field name for profile image
  goals: [
    {
      name: string;
    }
  ];
  skills: Skill[];
  role: string;
  experience_level: string;
  createdAt?: string;
  updatedAt?: string;
}

const EmployerCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const employer = useSelector(
    (state: RootState) => state.employerAuth.employer
  );
  const token = useSelector((state: RootState) => state.employerAuth.token);

  useEffect(() => {
    if (!employer || !token) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  const {
    data: allCandidatesData,
    isLoading,
    isError,
  } = useGetAllCandidatesQuery({
    page: 1,
    limit: 10,
    sort: "createdAt",
    order: "desc",
  });

  const candidatesData: ICandidate[] = allCandidatesData?.data ?? [];

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const columns = useMemo<ColumnDef<ICandidate>[]>(
    () => [
      {
        accessorKey: "name",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        cell: ({ row }) => {
          const candidate = row.original;
          const profileImage = candidate.profile_image || candidate.avatar;
          const initials = getInitials(candidate.name);

          return (
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profileImage} alt={candidate.name} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{candidate.name || "N/A"}</div>
                <div className="text-sm text-gray-500">
                  {candidate.email || "N/A"}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: "goals",
        header: "Goals",
        cell: ({ row }) => {
          const goals = row.original.goals || [];
          if (!goals.length) return "No goals";
          return goals.map((goal) => goal.name).join(", ");
        },
      },
      {
        accessorKey: "skills",
        header: "Skills",
        cell: ({ row }) => {
          const userSkills = row.original.skills || [];
          if (!userSkills.length) return "No skills";
          const verifiedCount = userSkills.filter(
            (skill) => skill.verified_rating >= 4
          ).length;
          const totalSkills = userSkills.length;

          return `${verifiedCount}/${totalSkills}`;
        },
      },
      {
        accessorKey: "createdAt",
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center"
          >
            Added Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return "N/A";
          return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          console.log(row.original.username);

          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareProfile(row.original.username)}
            >
              View Profile
            </Button>
          );
        },
      },
    ],
    [navigate]
  );

  const handleShareProfile = (username: string) => {
    const publicProfileUrl = `${window.location.origin}/profile/${username}`;
    window.open(publicProfileUrl, "_blank", "noopener,noreferrer");
  };

  const handleBackClick = () => {
    navigate(-1); // go back
  };

  // Transform the data for the DataTable
  const tableData = candidatesData.map((candidate) => ({
    ...candidate,
    id: candidate._id, // Ensure each row has an id property
  }));

  return (
    <div
      className="w-[95%] h-screen max-w-[1800px] overflow-y-auto p-5 bg-[#F5F5F5] mx-auto"
      style={{ scrollbarWidth: "none" }}
    >
      <div className="w-full max-w-screen-xl flex flex-col gap-6">
        {/* HEADER SECTION */}
        <section className="flex items-center justify-between">
          <div className="flex items-center space-x-2 gap-3">
            <button
              onClick={handleBackClick}
              className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
            >
              <img
                className="w-[10px] h-[10px]"
                src={arrow || "/placeholder.svg"}
                alt="Back"
              />
            </button>
            <h1 className="text-black font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.025rem]">
              Candidates
            </h1>
          </div>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="w-full">
          <div className="flex flex-col">
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-600">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading candidates...</span>
              </div>
            )}

            {isError && (
              <div className="text-red-600 mb-4">
                Error loading candidates. Please try again.
              </div>
            )}

            {!isLoading && !isError && candidatesData.length === 0 && (
              <Card className="text-center py-12">
                <CardContent>
                  <p className="text-gray-500">No candidates found.</p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && candidatesData.length > 0 && (
              <div className="bg-white rounded-md shadow-sm flex-1 overflow-hidden">
                <div className="p-4">
                  <section className="flex justify-between mb-4">
                    <h2 className="text-xl font-semibold">All Candidates</h2>
                    <h2 className="text-xl font-semibold">
                      Total candidates: {candidatesData.length}
                    </h2>
                  </section>
                  <DataTable
                    columns={columns}
                    rows={tableData}
                    searchPlaceholder="Search candidates by name..."
                    onRowClick={(rowData) =>
                      console.log("Row clicked:", rowData)
                    }
                    pageSize={10}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerCandidatesPage;
