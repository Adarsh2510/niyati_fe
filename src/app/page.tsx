"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="mb-8 text-4xl font-bold">Welcome to Niyati</h1>
      <p className="mb-8 text-center text-lg">
        Your AI-powered interview preparation platform
      </p>
      <div className="flex gap-4">
        <Link href="/login">
          <Button size="lg">Sign In</Button>
        </Link>
        <Link href="/signup">
          <Button size="lg" variant="outline">Create Account</Button>
        </Link>
      </div>
    </main>
  );
}
