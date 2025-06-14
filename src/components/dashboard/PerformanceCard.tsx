'use client';
import { Card } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { GetPastInterviewsResponse } from '@/lib/api/types';
import Conditional from '../Conditional';

interface PerformanceCardProps {
  interviews: GetPastInterviewsResponse['interviews'];
}

function formatChartData(interviews: GetPastInterviewsResponse['interviews']) {
  // Sort by date and take last 7 interviews
  const sortedInterviews = [...interviews]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 7)
    .reverse();

  return sortedInterviews.map(interview => ({
    day: new Date(interview.date).toLocaleDateString('en-US', { weekday: 'short' }),
    score: Math.round(interview.score * 10), // Convert to percentage
  }));
}

export function PerformanceCard({ interviews }: PerformanceCardProps) {
  const chartData = formatChartData(interviews);
  const averageScore =
    interviews.length > 0
      ? (interviews.reduce((acc, curr) => acc + curr.score, 0) / interviews.length) * 10
      : 0;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">My Performance</h2>
      <div className="h-[200px] w-full -ml-8">
        <Conditional if={interviews.length === 0}>
          <div className="ml-8 h-full flex items-center justify-center">
            <p className="text-gray-500 text-center mx-auto">
              No interviews found. Let&apos;s get started!
            </p>
          </div>
        </Conditional>
        <Conditional if={interviews.length > 0}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
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
                dot={{ fill: '#2563eb' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Conditional>
      </div>
    </Card>
  );
}
