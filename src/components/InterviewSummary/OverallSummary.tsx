import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
interface OverallSummaryProps {
  score: number
  summary: string
  strongPoints: string[]
  areasToImprove: string[]
}

const scoreData = (score: number) => {
  if (score > 8) {
    return {
      message: "Great Performance!",
      subMessage: "You're on the right track!",
    }
  } else if (score > 5 && score <= 8) {
    return {
      message: "Good Performance!",
      subMessage: "You're doing well, but there are some areas to improve.",
    }
  } else {
    return {
      message: "Needs Improvement!",
      subMessage: "There's an opportunity to do better. Keep pushing!",
    }
  }
}

export function OverallSummary({
  score,
  summary,
  strongPoints,
  areasToImprove,
}: OverallSummaryProps) {

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Interview Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-gray-700 dark:text-gray-300">{summary}</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Strong Points</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strongPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Areas to Improve</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {areasToImprove.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-500 mr-2">⚠️</span>
                    {point}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="md:col-span-1">

      <Card className="p-6 flex flex-col items-center justify-center">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold">{score?.toFixed(2)}</span>
          </div>
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray={`${(score / 10) * 377} 377`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
        <p className="mt-4 text-lg font-semibold text-center">
          {scoreData(score).message}
        </p>
        <p className="text-sm text-gray-500 text-center">
          {scoreData(score).subMessage}
        </p>
      </Card>
      </div>
    </div>
  )
}