import { Suspense } from "react"
import DashboardHeader from "@/components/common/DashboardHeader"
import { StartInterviewCard } from "@/components/dashboard/StartInterviewCard"
import { PerformanceCard } from "@/components/dashboard/PerformanceCard"
import { PastInterviewsCard } from "@/components/dashboard/PastInterviewsCard"
import Footer from "@/components/common/Footer"
import { SuggestedInterviews, TInterviewSuggestionCard } from "@/components/InterviewSummary/SuggestedInterviews"
import { BarChart, ChartArea, Clock, Layout, TreePine } from "lucide-react"
import { Code } from "lucide-react"

const companySpecificInterviews:TInterviewSuggestionCard[] = [
  {
    title: "TechCorp",
    subTitle: "Full Stack",
    textLogo: "TC",
    difficulty: "Medium",
    link: "/",
  },
  {
    title: "Innovative Solutions",
      subTitle: "Frontend Developer",
    textLogo: "IS",
    difficulty: "Medium",
    link: "/",
  },
  {
    title: "Creative Minds",
    subTitle: "Backend Developer",
    textLogo: "CM",
    difficulty: "Medium",
    link: "/",
  }]

const suggestedInterviewsData:TInterviewSuggestionCard[] = [
  {
    title: "Frontend Developer Interview",
    subTitle: "Tech Corp",
    difficulty: "Intermediate",
    descriptors: [
      {
        title: "60 mins",
        icon: Clock,
      }
    ],
    icon: BarChart,
    link: "/",
  },
  {
    title: "System Design Interview",
    subTitle: "StartUp Inc",
    difficulty: "Advanced",
    descriptors: [
      {
        title: "45 mins",
        icon: Clock,
      }
    ],
    icon: Layout,
    link: "/",
  },
  {
    title: "Data Structures & Algorithms",
    subTitle: "Tech Giants",
    difficulty: "Advanced",
    descriptors: [
      {
        title: "90 mins",
        icon: Clock,
      }
    ],
    icon: TreePine,
    link: "/",
  },
  {
    title: "Data Structures & Algorithms",
    subTitle: "Tech Giants",
    difficulty: "Advanced",
    descriptors: [
      {
        title: "90 mins",
        icon: Clock,
      }
    ],
    icon: TreePine,
    link: "/",
  }
]

const roleInterviewData:TInterviewSuggestionCard[] = [
  {
    title: "Frontend Developer",
    subTitle: "Software Engineer",
    descriptors:[
      {
        title:"25 questions",
        icon: Code,
      },
      {
        title:"2 hours",
        icon: Clock,
      },
      {
        title: "Medium",
        icon: ChartArea,
      }
    ],
    icon: Code,
    link: "/",
  },
    {
      title: "Backend Developer",
      subTitle: "Software Engineer",
      descriptors:[
        {
          title:"30 questions",
          icon: Code,
        },
        {
          title:"2.5 hours",
          icon: Clock,
        },
        {
          title: "Medium",
          icon: ChartArea,
        }
      ],
      icon: Code,
      link: "/",
  },
  {
    title: "Full Stack Developer",
    subTitle: "Software Engineer",
    descriptors:[
      {
        title:"40 questions",
        icon: Code,
      },
      {
        title:"3 hours",
        icon: Clock,
      },
      {
        title: "Medium",
        icon: ChartArea,
      }
    ],
    icon: Code,
    link: "/",
  }
]

export default async function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StartInterviewCard />
          <Suspense fallback={<div>Loading...</div>}>
            <PerformanceCard />
          </Suspense>
          <Suspense fallback={<div>Loading...</div>}>
            <PastInterviewsCard />
          </Suspense>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<div>Loading...</div>}>
            <SuggestedInterviews 
              sectionTitle="Recommended for you"
              data={suggestedInterviewsData}
            />
          </Suspense>
        </div>
        <div className="space-y-8">
          <Suspense fallback={<div>Loading...</div>}>
            <SuggestedInterviews 
              sectionTitle="Try out Role Specific Interviews"
              data={roleInterviewData}
            />
          </Suspense>
        </div>
        <div className="space-y-8">
          <Suspense fallback={<div>Loading...</div>}>
            <SuggestedInterviews 
              sectionTitle="Challenge Yourself with Company Specific Interviews"
              data={companySpecificInterviews}
            />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  )
}

