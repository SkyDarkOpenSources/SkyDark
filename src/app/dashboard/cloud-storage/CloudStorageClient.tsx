
"use client";

import { useState, useMemo } from "react";
import { Search, ExternalLink, Cloud, Server, Database, Zap, Bot, Cpu, Layers, Github, Container, Shield, Slack, MessageSquare, Share2, Rocket, Satellite, Network, CreditCard, Mail, Mailbox, Target, Globe, Terminal, HardDrive } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define the integrations data locally to keep it simple and focused
const integrations = [
  { id: "aws", name: "AWS S3", description: "Store and retrieve any amount of data from anywhere.", icon: Server, color: "text-orange-500" },
  { id: "azure", name: "Azure Blob", description: "Massively scalable object storage for any type of unstructured data.", icon: Database, color: "text-blue-500" },
  { id: "neon", name: "Neon Postgres", description: "Serverless Postgres with autoscaling and branching.", icon: Database, color: "text-[#00e599]" },
  { id: "cloudflare", name: "Cloudflare", description: "CDN, DNS, and edge computing for global scale.", icon: Zap, color: "text-orange-600" },
  { id: "openai", name: "OpenAI", description: "Integrate ChatGPT, DALL-E, and Whisper into your systems.", icon: Bot, color: "text-green-600" },
  { id: "anthropic", name: "Anthropic Claude", description: "Build robust AI agents for telemetry analysis and fault detection.", icon: Cpu, color: "text-amber-700" },
  { id: "github", name: "GitHub", description: "Automate your flight software deployments with Actions.", icon: Github, color: "text-slate-900" },
  { id: "docker", name: "Docker Hub", description: "Containerize and manage your aerospace microservices.", icon: Container, color: "text-blue-600" },
  { id: "slack", name: "Slack", description: "Receive rocket launch alerts and team updates in real-time.", icon: Slack, color: "text-[#4A154B]" },
  { id: "nasa", name: "NASA Open API", description: "Access curated astronomical data and satellite imagery.", icon: Rocket, color: "text-blue-800" },
  { id: "spacex", name: "SpaceX API", description: "Latest launch schedules, core telemetry, and dragon data.", icon: Satellite, color: "text-slate-800" },
  { id: "stripe", name: "Stripe", description: "Handle subscriptions and payouts for your space agency.", icon: CreditCard, color: "text-[#635BFF]" },
  { id: "resend", name: "Resend", description: "Transactional emails for launch invites and user updates.", icon: Mail, color: "text-black" },
  { id: "mongodb", name: "MongoDB Atlas", description: "Cloud-native NoSQL database for flexible space data.", icon: Database, color: "text-green-500" },
  { id: "google-cloud", name: "Google Cloud", description: "Computing, storage, and networking on Google infrastructure.", icon: Cloud, color: "text-blue-400" },
  { id: "digitalocean", name: "DigitalOcean", description: "Simple cloud hosting for aerospace startups.", icon: Server, color: "text-blue-600" },
  { id: "vercel", name: "Vercel", description: "Deploy your mission control dashboard with zero configuration.", icon: Zap, color: "text-black" },
  { id: "supabase", name: "Supabase", description: "The open source Firebase alternative for your backends.", icon: Database, color: "text-emerald-500" },
  { id: "redis", name: "Upstash Redis", description: "Serverless Redis for low-latency telemetry caching.", icon: Zap, color: "text-red-500" },
  { id: "posthog", name: "PostHog", description: "Product analytics and session recording for your apps.", icon: Target, color: "text-slate-800" },
];

export default function CloudStorageClient() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIntegrations = useMemo(() => {
    return integrations.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="flex-1 space-y-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloud & Storage</h1>
          <p className="text-muted-foreground">Expand your infrastructure with these integrations</p>
        </div>
        <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
          Pro Member
        </div>
      </div>

      <Card className="w-full bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Cloud className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">Cloud Storage Integrations</CardTitle>
                <CardDescription>Unified control plane for your aerospace cloud infrastructure.</CardDescription>
              </div>
            </div>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search integrations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-full"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-4">
            {filteredIntegrations.map((item) => (
              <div 
                key={item.id} 
                className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-4 hover:border-primary/40 transition-all hover:shadow-md group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("h-5 w-5", item.color)} />
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                  Connect {item.name.split(' ')[0]}
                </Button>
              </div>
            ))}
            
            {filteredIntegrations.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No integrations found matching "{searchQuery}"
              </div>
            )}
          </div>
          
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              Note: Cloud integration features are currently being deployed. Backend configuration will be available in the next release.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Backend Settings Section as requested */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card className="bg-card border-dashed border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4" /> API Webhooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Configure global webhooks for real-time telemetry streaming.
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>Configure</Button>
          </CardContent>
        </Card>
        
        <Card className="bg-card border-dashed border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="h-4 w-4" /> OAuth Gateway
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Manage shared credentials and token rotation.
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>Manage Keys</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-dashed border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <HardDrive className="h-4 w-4" /> Local Engine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">
              Deploy local compute engine for rocket infrastructure.
            </p>
            <Button size="sm" variant="outline" className="w-full" disabled>Download SDK</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
