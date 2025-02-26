import { getInterviewSummary } from "@/lib/api/getInterviewData";
import DashboardHeader from "@/components/common/DashboardHeader";
import { OverallSummary } from '@/components/InterviewSummary/OverallSummary'
import { QuestionWiseFeedback } from '@/components/InterviewSummary/QuestionWiseFeedback'
import { SuggestedInterviews, TInterviewSuggestionCard } from '@/components/InterviewSummary/SuggestedInterviews'
import Footer from "@/components/common/Footer";
import { Clock, TreePine, Code, Layout, BarChart } from "lucide-react";

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
      icon: Code,
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
      icon: BarChart,
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
export default async function InterviewSummary({params}: {params: {interview_id: string}}) {
    const { interview_id } = params;

    const interviewSummary = await getInterviewSummary({interview_id, user_id: 'test_user_id'});
    console.log('interviewSummary', interviewSummary);
    const { overall_feedback, total_score, section_wise_total_score, question_wise_feedback } = interviewSummary;
    const { strong_points, weak_points } = overall_feedback;

    return (
        <>
            <div className="container mx-auto px-4 py-6 space-y-8">
            <OverallSummary 
                score={total_score}
                summary={overall_feedback.summary}
                strongPoints={strong_points}
                areasToImprove={weak_points}
            />
            <QuestionWiseFeedback 
                data={question_wise_feedback}
            />
            <SuggestedInterviews 
                data={suggestedInterviewsData}
                sectionTitle="Recommended for you"
            />
            </div>
            <Footer/>
        </>
    );
}