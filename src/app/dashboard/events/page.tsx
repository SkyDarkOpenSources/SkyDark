// src/app/dashboard/events/page.tsx
"use client"; // Required for interactivity

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Events } from "@/data/data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Event {
  name: string;
  date: string;
  description: string;
  link: string;
}

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Small delay for smoother animation
    setTimeout(() => setSelectedEvent(null), 300);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      {Events.length === 0 ? (
        <p className="text-gray-500">No upcoming events scheduled.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Events.map((event: Event, index: number) => (
            <EventCard 
              key={index} 
              event={event} 
              onLearnMore={() => handleLearnMore(event)} 
            />
          ))}
        </div>
      )}

      {/* Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-y-auto">
          <button 
            onClick={closeModal}
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <span className="sr-only">Close</span>
          </button>
          
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedEvent.name}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selectedEvent.description}
                </p>
                <div className="mt-6 space-y-2">
                  <h3 className="font-medium">Event Details:</h3>
                  <p className="text-sm text-muted-foreground">
                    Date: {new Date(selectedEvent.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function EventCard({ event, onLearnMore }: { event: Event, onLearnMore: () => void }) {
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-xl">{event.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {formattedDate}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="line-clamp-3">              
          {event.description}
        </p>
      </CardContent>
      
      <CardFooter>
        <Button onClick={onLearnMore} className="w-full">
          Learn More
        </Button>
      </CardFooter>
    </Card>
  );
}