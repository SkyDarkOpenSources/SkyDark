"use client";
import { useUser } from "@clerk/nextjs";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome {user?.fullName}</h1>
      {user ? (
        <p className="text-lg">Hello, {user.fullName}!</p>
      ) : (
        <p className="text-lg">Please sign in to access your dashboard.</p>
      )}
    </div>
  );
}
