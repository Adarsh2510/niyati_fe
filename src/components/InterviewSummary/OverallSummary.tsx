import { TOverallFeedback } from "@/lib/api/types";

type TOverallSummaryProps = {    
    total_score: number;
    overall_feedback: TOverallFeedback;
}

export default function OverallSummary(props: TOverallSummaryProps) {
    const {overall_feedback, total_score} = props;

    return (
        <div className="pl-8 pr-8">
            <h1 className="pt-8 text-2xl font-bold">Interview Feedback</h1>
            <div className="pt-4 flex flex-row gap-4">
                <div className="">
                <h2 className="text-lg font-bold">Overall Feedback</h2>
                <p>{overall_feedback.summary}</p>
                </div>
                <div></div>
            </div>
        </div>
    );
}   