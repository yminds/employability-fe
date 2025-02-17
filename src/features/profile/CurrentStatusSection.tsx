import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface CurrentStatusSectionProps {
  onStatusChange: (status: string) => void;
  user: any;
}

export default function CurrentStatusSection({
  onStatusChange,
  user,
}: CurrentStatusSectionProps) {
  const [currentStatus, setCurrentStatus] = useState<string>(
    user.current_status || "Actively seeking job"
  );

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setCurrentStatus(newStatus);
    onStatusChange(newStatus);
  };

  return (
    <Card className="w-full bg-white p-0 rounded-lg">
      <CardContent className="p-8">
        <h2 className="text-[#000000] text-sub-header mb-4">Current Status</h2>
        <div className="relative">
          <select
            className="block w-full border border-gray-300 rounded-md py-2 px-4 text-[#000000] text-body2 appearance-none pr-10"
            value={currentStatus}
            onChange={handleStatusChange}
          >
            <option>Actively seeking job</option>
            <option>Open to offers</option>
            <option>Not looking</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#414447]">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
