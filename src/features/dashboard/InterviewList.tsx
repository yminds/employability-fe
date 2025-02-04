import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Mock data for interviews (replace with actual API call in production)
const mockInterviews = [
  { id: 1, company: "Tech Corp", type: "Technical", dueDate: "2023-06-15" },
  { id: 2, company: "Innovate Inc", type: "Technical", dueDate: "2023-06-18" },
  { id: 3, company: "Future Systems", type: "Technical Design", dueDate: "2023-06-20" },
  { id: 4, company: "Dev Solutions", type: "Technical", dueDate: "2023-06-22" },
  { id: 5, company: "Code Masters", type: "Behavioral", dueDate: "2023-06-25" },
];

interface Interview {
  id: number;
  company: string;
  type: string;
  dueDate: string;
}

interface InterviewListProps {
  isDashboard?: boolean;
  isLoading?: boolean;
}

const InterviewList: React.FC<InterviewListProps> = ({ isDashboard = false, isLoading = false }) => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    // Simulating API call
    setTimeout(() => {
      setInterviews(mockInterviews);
    }, 1000);
  }, []);

  const displayedInterviews = isDashboard ? interviews.slice(0, 3) : interviews;
  const totalInterviews = interviews.length;

  const handleInterviewClick = () => {
    if (isDashboard) {
      navigate('/interviews');
    }
  };

  const renderLoadingSkeleton = () => (
    <TableRow>
      <TableCell><Skeleton /></TableCell>
      <TableCell><Skeleton /></TableCell>
      <TableCell><Skeleton /></TableCell>
    </TableRow>
  );

  return (
    <Card className="w-full">
      <CardHeader>
      <h2 className="text-[#1f2226] text-lg font-medium font-['Ubuntu'] leading-snug">
            Upcoming Interviews ({totalInterviews})
          </h2>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Company Name</TableHead>
              <TableHead>Interview Type</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array(3).fill(null).map((_, index) => renderLoadingSkeleton())
              : displayedInterviews.map((interview, index) => (
                  <TableRow 
                    key={interview.id} 
                    className="cursor-pointer"
                    onClick={handleInterviewClick}
                  >
                    <TableCell>{interview.company}</TableCell>
                    <TableCell>{interview.type}</TableCell>
                    <TableCell>{interview.dueDate}</TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
          
        </Table>
        
        {!isLoading && displayedInterviews.length === 0 && (
          <div className="text-gray-500 text-center py-4">No interviews found</div>
        )}
       {isDashboard && totalInterviews > 3 && (
          <div className="w-full flex justify-center mt-4">
            <button
              onClick={() => navigate("/interviews")}
              className="flex items-center gap-1 text-[#001630] text-sm font-medium hover:underline"
            >
              View all
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8 3.33334L8 12.6667"
                  stroke="#001630"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.6667 8L8.00004 12.6667L3.33337 8"
                  stroke="#001630"
                  strokeWidth="1.33333"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterviewList;
