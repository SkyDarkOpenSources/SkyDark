"use client";
import { useUser, useAuth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default function Dashboard() {
  const { user } = useUser();
  const { isSignedIn } = useAuth()

  if (!isSignedIn){
    return(
      redirect('sign-in')
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome {user?.username}.</h1>
      {user ? (
        <p className="text-lg">Hello, {user.username}!</p>
      ) : (
        <p className="text-lg">Please sign in to access your dashboard.</p>
      )}
    </div>
  );
}
