"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Search, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface UserResult {
  id: string;
  fullName: string;
  emailAddress: string;
  imageUrl?: string;
  createdAt: number;
}

// Debounce function with proper typing
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function SearchPage() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<UserResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !userId) {
      router.push("/sign-in");
    }
  }, [isLoaded, userId, router]);

  // Search function
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`);
      
      if (response.ok) {
        const users: UserResult[] = await response.json();
        setSearchResults(users);
      } else {
        console.error("Search failed");
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(performSearch, 300),
    []
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery);
  }, [searchQuery, debouncedSearch]);

  const handleUserClick = (user: UserResult) => {
    // Handle user click - you can navigate to profile, etc.
    console.log("User clicked:", user);
    // Example: router.push(`/profile/${user.id}`);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Show loading while auth is loading
  if (!isLoaded) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!userId) {
    return null;
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Search Users</h1>
          <p className="text-muted-foreground">Find and connect with other users</p>
        </div>
      </div>

      {/* Search Interface */}
      <div className="w-full max-w-2xl mx-auto space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Search Results */}
        <Card>
          <CardContent className="p-0">
            {isLoading && (
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">Searching...</p>
              </div>
            )}

            {!isLoading && hasSearched && searchResults.length === 0 && (
              <div className="p-6 text-center">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No users found</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Try searching with a different name or email
                </p>
              </div>
            )}

            {!isLoading && !hasSearched && (
              <div className="p-6 text-center">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Start typing to search for users</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Search by name or email address
                </p>
              </div>
            )}

            {!isLoading && searchResults.length > 0 && (
              <div className="divide-y divide-border">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserClick(user)}
                    className="flex items-center p-4 hover:bg-muted/50 cursor-pointer transition-colors group"
                  >
                    {/* User info on the left, Avatar on the right (Instagram style) */}
                    <div className="flex-1 flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-base leading-none mb-1 group-hover:text-primary transition-colors">
                          {user.fullName || "Unknown User"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {user.emailAddress}
                        </p>
                      </div>
                      
                      {/* Avatar positioned on the right */}
                      <Avatar className="h-12 w-12 ml-3">
                        <AvatarImage src={user.imageUrl} alt={user.fullName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                          {getInitials(user.fullName || "U")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results count */}
        {hasSearched && !isLoading && searchResults.length > 0 && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="text-xs">
              {searchResults.length} user{searchResults.length !== 1 ? 's' : ''} found
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}