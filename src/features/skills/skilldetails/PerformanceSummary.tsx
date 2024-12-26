import { Card, CardContent } from "@/components/ui/card"


const PerformanceSummary = () => {
  return (
    <Card className="border-none shadow-sm p-4 bg-white rounded-lg">
    <CardContent className="items-center justify-between">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">You have performed better than 60% of candidates on Employability</h3>
      </div>
      <div className="text-start bg-green-50 p-2">
      <p className="text-sm text-gray-600 mt-2">Overall Score</p>
        <p className="text-md font-bold text-green-500">5.2/10</p>
      </div>
    </CardContent>
  </Card>
  )
}

export default PerformanceSummary