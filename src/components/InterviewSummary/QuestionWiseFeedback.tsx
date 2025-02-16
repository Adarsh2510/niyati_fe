
import { Card } from "@/components/ui/card"
import { TQuestionWiseFeedback } from "@/lib/api/types"
import Conditional from "@/components/Conditional"



export function QuestionWiseFeedback({ data }: { data: TQuestionWiseFeedback[] }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Detailed Analysis</h2>
      <div className="space-y-6">
        {data.map((question, index) => (
          <Card key={index} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-sm text-gray-500">{question.section_name}</h3>
                <h4 className="text-lg font-semibold">{question.question_name}</h4>
              </div>
              <div className=" h-12 w-26 flex items-center justify-center">
                <span className="text-blue-700 dark:text-blue-300 font-semibold">
                  {`Score: ${question.score} / 10`}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Conditional if={question.feedback.length > 0}>
                <div>
                  <h5 className="font-semibold mb-2">Feedback</h5>
                  <ul className="space-y-1">
                  {question.feedback.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
              </Conditional>

              <Conditional if={question.weak_points.length > 0}>
                <div className="bg-red-50 p-4 rounded-md">
                  <h5 className="font-semibold mb-2">Areas to Improve</h5>
                  <ul className="space-y-1">
                  {question.weak_points.map((point, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className=" mr-2">⚠️</span>
                      {point}
                    </li>
                  ))}
                </ul>
                </div>
              </Conditional>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 