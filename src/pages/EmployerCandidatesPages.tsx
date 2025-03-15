// src/pages/employer/EmployerCandidatesPage.tsx
import React, { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";

import { Candidate, useGetCompanyCandidatesQuery } from "@/api/employerJobsApiSlice";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

// If you have a back arrow icon
import arrow from "@/assets/skills/arrow.svg"; // adjust path to your arrow image

interface ICandidate {
  _id: string;
  name: string;
  email: string;
  role: string;
  experience_level: string;
}

const EmployerCandidatesPage: React.FC = () => {
  const navigate = useNavigate();
  const employer = useSelector((state: RootState) => state.employerAuth.employer);
  const token = useSelector((state: RootState) => state.employerAuth.token);

  useEffect(() => {
    if (!employer || !token) {
      navigate("/employer/login");
    }
  }, [employer, token, navigate]);

  // Query the company candidates
  const { data, isLoading, isError, refetch } = useGetCompanyCandidatesQuery(
    { company_id: employer?.company?._id },
    { skip: !employer?.company }
  );

  // Adjust how you access the array below:
  const candidatesData: Candidate[] = data?.data ?? [];

  // Define columns for React Table
  const columns = useMemo<ColumnDef<ICandidate>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
      },
      {
        
        accessorKey: "contact.email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Role",
      },
      {
        accessorKey: "experience_level",
        header: "Experience Level",
      },
    ],
    []
  );

  const table = useReactTable({
    data: candidatesData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleBackClick = () => {
    navigate(-1); // go back
  };

  return (
    <div className="w-[95%] h-screen overflow-hidden max-w-[1800px] p-5 bg-[#F5F5F5] mx-auto">
      <div className="w-full max-w-screen-xl flex flex-col gap-6">
        {/* HEADER SECTION */}
        <section className="flex items-center space-x-2 gap-3">
          <button
            onClick={handleBackClick}
            className="w-[30px] h-[30px] bg-white border-2 rounded-full flex justify-center items-center"
          >
            <img className="w-[10px] h-[10px]" src={arrow} alt="Back" />
          </button>
          <h1 className="text-black font-ubuntu text-[20px] font-medium leading-[26px] tracking-[-0.025rem]">
            All Candidates
          </h1>
        </section>

        {/* MAIN CONTENT SECTION */}
        <section className="w-full h-[calc(100vh-2rem)]">
          <div className="h-full flex flex-col">
            {/* <div className="mb-4 flex items-center justify-end">
              <Button variant="outline" onClick={() => refetch()}>
                Refresh
              </Button>
            </div> */}

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
                  <p className="text-gray-500">
                    No candidates found for this company.
                  </p>
                </CardContent>
              </Card>
            )}

            {!isLoading && !isError && candidatesData.length > 0 && (
              <div className="overflow-auto bg-white rounded-md shadow-sm flex-1">
                <table className="min-w-full text-sm text-gray-700 border-collapse">
                  <thead className="bg-gray-100">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-2 text-left font-medium border-b"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="px-4 py-2 border-b align-top"
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default EmployerCandidatesPage;
