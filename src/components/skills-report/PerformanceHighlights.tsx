import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface PerformanceRating {
    criteria: string;
    rating: number;
  }
  
  interface HighlightsProps {
    highlights: PerformanceRating[];
  }
const PerformanceHighlights: React.FC<HighlightsProps> = ({ highlights }) => {
  const getRatingLabel = (rating: number): string => {
    switch (rating) {
      case 5:
        return 'Excellent';
      case 4:
        return 'Strong';
      case 3:
        return 'Good';
      case 2:
        return 'Weak';
      case 1:
        return 'Needs Improvement';
      default:
        return 'N/A';
    }
  };

  const getRatingStyles = (rating: number): string => {
    switch (rating) {
      case 5:
        return 'bg-green-100 text-green-600';
      case 4:
        return 'bg-blue-100 text-blue-600';
      case 3:
        return 'bg-yellow-100 text-yellow-600';
      case 2:
        return 'bg-red-100 text-red-500';
      case 1:
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <Card className="w-full py-[42px] bg-white rounded-xl">
      <div>
        <h2 className="text-body1 font-medium p-0 mb-6">Performance Highlights</h2>
      </div>
      <div>
        <div className="rounded-lg border border-gray-200 overflow-hidden">
            <div className="grid grid-cols-2 bg-gray-50 border-b">
                <div className="p-4 text-gray-600 font-medium">Criteria</div>
                <div className="p-4 text-gray-600 font-medium">Performance Rating</div>
            </div>
            {highlights.map((item, index) => (
                <div
                key={index}
                className="grid grid-cols-2  last:border-b-0 items-center"
                >
                <div className="p-4 text-gray-700">{item.criteria}</div>
                <div className="p-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium bg-none ${getRatingStyles(item.rating)}`}>
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