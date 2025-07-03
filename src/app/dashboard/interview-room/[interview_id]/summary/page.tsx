import { getInterviewSummary } from '@/lib/api/getInterviewData';
import { OverallSummary } from '@/components/InterviewSummary/OverallSummary';
import { QuestionWiseFeedback } from '@/components/InterviewSummary/QuestionWiseFeedback';
import { SuggestedInterviews } from '@/components/InterviewSummary/SuggestedInterviews';
import Footer from '@/components/common/Footer';
import { suggestedInterviewsData } from '@/app/dashboard/page';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export default async function InterviewSummary({ params }: { params: { interview_id: string } }) {
  const { interview_id } = params;

  // Get the session to access the user ID
  const session = await getServerSession(authOptions);
  // The ProtectedComponent in the layout will handle redirects if no session exists

  try {
    const interviewSummary = await getInterviewSummary({
      interview_id,
      user_id: session!.user.id,
    });

    const { overall_feedback, total_score, question_wise_feedback } = interviewSummary;
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
          <QuestionWiseFeedback data={question_wise_feedback} />
          <SuggestedInterviews data={suggestedInterviewsData} sectionTitle="Recommended for you" />
        </div>
        <Footer />
      </>
    );
  } catch (error) {
    console.error('Failed to fetch interview summary:', error);
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Error Loading Summary</h1>
        <p>Unable to load the interview summary. Please try again later.</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
        >
          Retry
        </button>
      </div>
    );
  }
}
