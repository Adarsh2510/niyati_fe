import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Link from "next/link"

export function StartInterviewCard() {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900 dark:to-blue-950">
      <div className="p-6 pt-12 pb-12">
        <div className="flex flex-col items-start space-y-4">
          <div className="rounded-full bg-blue-100 dark:bg-blue-800 p-3">
            <Play className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Start Interview</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Practice with AI-powered interviews
            </p>
          </div>

          <Link href="/interview/new" className="w-full">
            <Button className="w-full">
              Start Practice
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  )
} 