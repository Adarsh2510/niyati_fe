import Link from "next/link";
export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <Link href="/dashboard/interview-room" className="text-blue-500">
        Interview Room
      </Link>
    </div>
  );
}

