import { Card } from '@/components/ui/card';

interface PerformanceRating {
    criteria: string;
    rating: number;
  }
  
  interface HighlightsProps {
    highlights: PerformanceRating[];
    isGeneratingPDF?: boolean;
  }

 export  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Good';
      case 3:
        return 'Average';
      case 2:
        return 'Weak';
      case 1:
        return 'Poor';
      default:
        return 'Poor';
    }
  };

  export const getRatingStyles = (rating: number): string => {
    switch (rating) {
      case 5:
        return 'bg-[#DBFFEA80] text-[#03963F]';
      case 4:
        return 'bg-[#FFF2DB80] text-[#F0A422]';
      case 3:
        return 'bg-[#F08F641F] text-[#F08F64]';
      case 2:
        return 'bg-[#FFE5E780] text-[#CF0C19]';
      case 1:
        return 'bg-[#FFE5E780] text-[#CF0C19]';
      default:
        return 'bg-[#FFE5E780] text-[#CF0C19]';
    }
  };

const PerformanceHighlights: React.FC<HighlightsProps> = ({ highlights, isGeneratingPDF }) => {


  return (
    <Card className="w-full bg-white rounded-lg">
      <div>
        <h2 className="text-body1 font-medium p-0 mb-6">Performance Highlights</h2>
      </div>
      <div>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-50 border-b">
                <div className="p-4 text-gray-600 font-medium">Criteria</div>
                <div className="p-4 text-gray-600 font-medium">Performance Rating</div>
            </div>
            {highlights?.map((item, index) => (
                <div
                key={index}
                className="grid grid-cols-2  last:border-b-0 items-center"
                >
                <div className="p-4 text-gray-700">{item.criteria}</div>
                <div className="p-0 ">
                    <span className={`p-3 rounded-full text-sm font-medium bg-none ${!isGeneratingPDF ? getRatingStyles(item.rating): "text-gray-600"} `}>
                    {getRatingLabel(item.rating)}
                    </span>
                </div>
                </div>
            ))}
            </div>
      </div>

    </Card>
  );
};

export default PerformanceHighlights;