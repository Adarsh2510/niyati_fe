import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ScrollArea } from "@/components/ui/scroll-area"

async function getPastInterviews() {
  // TODO: Replace with actual API call
  return [
    {
      id: "1",
      title: "Frontend Developer Interview",
      date: "Jan 20, 2024",
      score: 85,
    },
    {
      id: "2",
      title: "System Design Discussion",
      date: "Jan 15, 2024",
      score: 88,
    },
    {
      id: "3",
      title: "JavaScript Fundamentals",
      date: "Jan 10, 2024",
      score: 92,
    },
    {
      id: "4",
      title: "React Interview",
      date: "Jan 5, 2024",
      score: 95,
    },
    
  ]
}

export async function PastInterviewsCard() {
  const interviews = await getPastInterviews()
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">Past Interviews</h2>
      <ScrollArea className="h-[200px] w-full pr-4">
        <div>
          {interviews.map((interview) => (
            <Link
              key={interview.id}
              href={`/dashboard/interview-room/${interview.id}/summary`}
              className="block"
            >
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <div>
                  <h3 className="font-medium">{interview.title}</h3>
                  <p className="text-sm text-gray-500">{interview.date}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {Math.round((interview.score/10)*100)}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </ScrollArea>
    </Card>
  )
} 