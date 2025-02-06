import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Sparkles } from 'lucide-react';

interface ConceptRating {
  concept: string;
  rating: string;
  reason: string;
}

interface ReportProps {
  summary: string;
  concept_ratings: ConceptRating[];
  createdAt: Date;
}

const InterviewReport: React.FC<ReportProps> = ({ summary, concept_ratings, createdAt }) => {
  const getRatingColor = (rating: string) => {
    const score = parseInt(rating.split('/')[0]);
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-blue-600";
    return "text-orange-600";
  };

  const getEmoji = (rating: string) => {
    const score = parseInt(rating.split('/')[0]);
    if (score >= 4) return <Trophy className="inline w-5 h-5 text-yellow-500" />;
    if (score >= 3) return <Star className="inline w-5 h-5 text-blue-500" />;
    return <Sparkles className="inline w-5 h-5 text-purple-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="border-t-4 border-t-blue-500">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            Interview Feedback
          </CardTitle>
          <p className="text-sm text-gray-500">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Summary</h3>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Skills Assessment</h3>
            {concept_ratings.map((rating, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4 transition-all hover:shadow-md">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {getEmoji(rating.rating)} {rating.concept}
                  </h4>
                  <Badge variant="outline" className={`${getRatingColor(rating.rating)}`}>
                    {rating.rating}
                  </Badge>
                </div>
                <p className="text-gray-600">{rating.reason}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewReport;