export default function InterviewSummary({params}: {params: {interview_id: string}}) {
    const { interview_id } = params;

    return <div>Interview Summary for {interview_id}</div>;
}