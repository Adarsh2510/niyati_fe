import { getInterviewSummary } from "@/lib/api/getInterviewData";
import DashboardHeader from "@/components/common/DashboardHeader";
import OverallSummary from "@/components/InterviewSummary/OverallSummary";
export default async function InterviewSummary({params}: {params: {interview_id: string}}) {
    const { interview_id } = params;

    const interviewSummary = await getInterviewSummary({interview_id, user_id: 'test_user_id'});
    console.log('interviewSummary', interviewSummary);
    const { overall_feedback, total_score, section_wise_total_score, question_wise_feedback } = interviewSummary;

    return (
        <div>
            <DashboardHeader />
            <OverallSummary
            overall_feedback={overall_feedback}
            total_score={total_score}
            />
            
        </div>
    );
}