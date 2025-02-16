import { getInterviewSummary } from "@/lib/api/getInterviewData";
import DashboardHeader from "@/components/common/DashboardHeader";
import { OverallSummary } from '@/components/InterviewSummary/OverallSummary'
import { QuestionWiseFeedback } from '@/components/InterviewSummary/QuestionWiseFeedback'
import { SuggestedInterviews } from '@/components/InterviewSummary/SuggestedInterviews'

export default async function InterviewSummary({params}: {params: {interview_id: string}}) {
    const { interview_id } = params;

    const interviewSummary = await getInterviewSummary({interview_id, user_id: 'test_user_id'});
    console.log('interviewSummary', interviewSummary);
    const { overall_feedback, total_score, section_wise_total_score, question_wise_feedback } = interviewSummary;
    const { strong_points, weak_points } = overall_feedback;

    return (
        <>
            <DashboardHeader />
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
            <SuggestedInterviews />
            </div>
        </>
    );
}