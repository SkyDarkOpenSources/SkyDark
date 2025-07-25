"use client";

import { Events } from "@/data/data";
import { Calendar, MapPin, ArrowRight, Rocket } from "lucide-react";
import Navbar from "@/components/navbar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Footer from "@/components/footer";

export default function EventsPage() {
  const { isSignedIn } = useUser();
  const router = useRouter();

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Handle click event for Learn More button
  const handleLearnMoreClick = () => {
    if (isSignedIn) {
      router.push('/dashboard/events');
    } else {
      router.push('/sign-in');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-32 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">SkyDark Events</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Join us for workshops and showcases of our latest technologies
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-6">
          {Events.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl text-gray-400">No upcoming events at this time</h3>
              <p className="mt-2 text-gray-500">Check back later for updates</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Events.map((event, index) => (
                <div 
                  key={index} 
                  className="bg-gray-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-blue-500/20 transition-all"
                >
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-blue-400 mb-2">
                      <Rocket size={16} />
                      <span className="text-sm font-medium">{event.category}</span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2">{event.name}</h3>
                    <p className="text-gray-300 mb-4">{event.description}</p>
                    
                    <div className="flex flex-col gap-2 mt-6">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Calendar size={16} />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-400">
                          <MapPin size={16} />
                          <span>{event.location || "Location TBD"}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={handleLearnMoreClick}
                      className="mt-6 w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      Learn More <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}