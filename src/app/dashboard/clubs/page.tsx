"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import Link from "next/link";
import Image from "next/image";
import { getAllClubs } from "../../../../lib/actions/club.action";
import { Club } from "../../../../database/schema";
import { Users } from "lucide-react";

interface ClubDialogProps {
  club: Club;
}

// Club Dialog Component
function ClubDialog({ club }: ClubDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full bg-teal-600 hover:bg-teal-700">View Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{club.name}</DialogTitle>
          <DialogDescription>{club.description}</DialogDescription>
        </DialogHeader>

        <div className="relative h-64 w-full mb-4">
          <Image
            src={club.image}
            alt={club.name}
            fill
            className="object-cover rounded-lg"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder-club.jpg";
            }}
          />
        </div>

        <div className="flex gap-3">
          <Button className="flex-1 bg-teal-600 hover:bg-teal-700">Join Club</Button>
          <Button variant="outline" className="flex-1">Contact</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ClubsPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch clubs from database
  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setIsLoading(true);
        const fetchedClubs = await getAllClubs();
        setClubs(fetchedClubs);
      } catch (err) {
        setError("Failed to load clubs. Please try again.");
        console.error("Error fetching clubs:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter((club) =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
          <p>Loading clubs...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h3 className="text-xl font-semibold mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()} className="bg-teal-600 hover:bg-teal-700">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Space-Tech Clubs</h1>
          <p className="text-gray-600">Explore and join clubs that interest you.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/club-create" className="bg-teal-600 hover:bg-teal-700 text-white">
            + Create Club
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <Input
          type="text"
          placeholder="Search clubs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/3"
        />
      </div>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No clubs found</h3>
          <p className="text-gray-500">Try searching for something else.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club) => (
            <Card key={club.id} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={club.image}
                  alt={club.name}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-club.jpg";
                  }}
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-white/90 text-teal-700 hover:bg-white">
                    <Users size={12} className="mr-1" />
                    {club.members || 0}
                  </Badge>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-gray-900 line-clamp-1">{club.name}</CardTitle>
                <CardDescription className="text-gray-600 line-clamp-2 text-sm">{club.description}</CardDescription>
              </CardHeader>

              <CardFooter className="pt-0">
                <ClubDialog club={club} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
