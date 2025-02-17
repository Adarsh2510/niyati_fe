"use client"
import { Card } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

async function getPerformanceData() {
  // TODO: Replace with actual API call
  return [
    { day: "Mon", score: 75 },
    { day: "Tue", score: 80 },
    { day: "Wed", score: 85 },
    { day: "Thu", score: 82 },
    { day: "Fri", score: 87 },
  ]
}

export async function PerformanceCard() {
  const data = await getPerformanceData()

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Performance</h2>
      <div className="h-[200px] w-full -ml-8">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis 
              dataKey="day" 
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={2}
              dot={{ fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
} 