"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { founders } from "@/data/data";
import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function About() {
  const [selectedFounder, setSelectedFounder] = useState<null | (typeof founders)[0]>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Background Pattern Container */}
      <div className="relative min-h-screen w-full">
        {/* Dotted Radial Background */}
        <div className="relative h-full w-full bg-white dark:bg-gray-950">
          <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Content */}
        <main className="relative container mx-auto px-4 py-16">
          <div className="text-center space-y-8">
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                About Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mt-4">
                Pioneering the future of aerospace technology through innovation, open-source collaboration, and education.
              </p>
            </div>
          </div>

          {/* About Sections */}
          <div className="max-w-4xl mx-auto space-y-8 mt-16">
            {/* Mission Section */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                At SkyDark, we're dedicated to democratizing aerospace technology by building cutting-edge model rockets, drones, UAVs, and spacecraft while making all our projects open-source. We believe in fostering a community where knowledge is shared freely to accelerate innovation in the aerospace sector.
              </p>
            </div>

            {/* Projects Section */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Our Projects</h2>
              <h3 className="text-xl font-semibold mb-2">Open-Source Aerospace</h3>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                All our projects are developed openly with documentation, schematics, and source code available to the public. We build:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li><span className="font-medium">Model Rockets</span> - High-performance amateur rockets with advanced telemetry systems</li>
                <li><span className="font-medium">Drones & UAVs</span> - Custom drones for research, photography, and industrial applications</li>
                <li><span className="font-medium">Spacecraft Systems</span> - Experimental modules for small satellite and cubesat platforms</li>
                <li><span className="font-medium">Avionics</span> - Open-source flight computers and ground station software</li>
              </ul>
            </div>

            {/* Education Section */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-4">Education & Courses</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                We offer comprehensive courses designed to equip the next generation of aerospace engineers and enthusiasts with practical skills:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-lg">
                  <h4 className="font-semibold">Introduction to Rocketry</h4>
                  <p className="text-sm text-muted-foreground">Fundamentals of rocket design, propulsion, and flight dynamics</p>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-lg">
                  <h4 className="font-semibold">Drone Systems Engineering</h4>
                  <p className="text-sm text-muted-foreground">From basic quadcopters to advanced autonomous UAV systems</p>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-lg">
                  <h4 className="font-semibold">Aerospace Avionics</h4>
                  <p className="text-sm text-muted-foreground">Flight computers, sensors, and communication systems for aerospace applications</p>
                </div>
                <div className="bg-white/20 dark:bg-gray-800/20 p-4 rounded-lg">
                  <h4 className="font-semibold">Spacecraft Systems Design</h4>
                  <p className="text-sm text-muted-foreground">Principles of spacecraft engineering and mission planning</p>
                </div>
              </div>
            </div>

            {/* Founders Section */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8">
              <h2 className="text-3xl font-bold mb-8 text-center">Our Founders</h2>
              <div className="flex flex-wrap justify-center gap-8">
                {founders.map((founder) => (
                  <div 
                    key={founder.name} 
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() => setSelectedFounder(founder)}
                  >
                    <div className="relative h-32 w-32 rounded-full overflow-hidden">
                      <Image
                        src={founder.image}
                        alt={founder.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{founder.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Join Us Section */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-lg p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Whether you're an engineer, student, or aerospace enthusiast, there's a place for you at SkyDark. Contribute to our open-source projects, enroll in our courses, or collaborate with us on the next frontier of aerospace technology.
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>

      {/* Founder Modal */}
      <Dialog open={!!selectedFounder} onOpenChange={(open) => !open && setSelectedFounder(null)}>
        {selectedFounder && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">{selectedFounder.name}</DialogTitle>
            </DialogHeader>
            <div className="flex items-start space-x-4">
              <div className="relative h-24 w-24 rounded-full overflow-hidden flex-shrink-0">
                <Image
                  src={selectedFounder.image}
                  alt={selectedFounder.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">{selectedFounder.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{selectedFounder.bio}</p>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}