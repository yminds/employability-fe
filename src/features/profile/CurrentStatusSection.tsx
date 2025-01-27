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
    <Card className="w-full bg-white p-6 rounded-lg">
      <CardContent className="p-6">
        <h2 className="text-[#000000] font-ubuntu text-base font-medium leading-[22px] mb-4">
          Current Status
        </h2>
        <div className="relative">
          <select
            className="block w-full border font-sf-pro border-gray-300 rounded-md py-2 px-4 text-[#000000] text-base font-normal leading-6 tracking-[0.24px] appearance-none pr-10"
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
