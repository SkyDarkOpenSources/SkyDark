
import { 
  Cloud, 
  Server, 
  Database, 
  Slack, 
  Github, 
  CreditCard, 
  Mail, 
  MessageSquare, 
  Shield, 
  Zap, 
  Globe, 
  Cpu, 
  Rocket, 
  Wind, 
  Satellite, 
  Trello, 
  Figma, 
  Mailbox,
  Bot,
  Layers,
  Code,
  Target,
  Share2,
  Terminal,
  Container,
  HardDrive,
  Network
} from "lucide-react";

export interface Integration {
  id: string;
  name: string;
  description: string;
  category: "Cloud" | "AI" | "DevTools" | "Communication" | "Productivity" | "Marketing" | "Aerospace" | "Finance";
  icon: any;
  status: "Connected" | "Disconnected" | "Pending" | "Beta";
  isPro: boolean;
  color: string;
}

export const integrations: Integration[] = [
  // Cloud
  {
    id: "aws",
    name: "AWS S3",
    description: "Store and retrieve any amount of data from anywhere.",
    category: "Cloud",
    icon: Server,
    status: "Disconnected",
    isPro: true,
    color: "text-orange-500",
  },
  {
    id: "azure",
    name: "Azure Blob",
    description: "Massively scalable object storage for any type of unstructured data.",
    category: "Cloud",
    icon: Database,
    status: "Disconnected",
    isPro: true,
    color: "text-blue-500",
  },
  {
    id: "neon",
    name: "Neon Postgres",
    description: "Serverless Postgres with autoscaling and branching.",
    category: "Cloud",
    icon: Database,
    status: "Disconnected",
    isPro: true,
    color: "text-[#00e599]",
  },
  {
    id: "cloudflare",
    name: "Cloudflare",
    description: "CDN, DNS, and edge computing for global scale.",
    category: "Cloud",
    icon: Zap,
    status: "Beta",
    isPro: true,
    color: "text-orange-600",
  },

  // AI
  {
    id: "openai",
    name: "OpenAI",
    description: "Integrate ChatGPT, DALL-E, and Whisper into your rocket systems.",
    category: "AI",
    icon: Bot,
    status: "Disconnected",
    isPro: true,
    color: "text-green-600",
  },
  {
    id: "anthropic",
    name: "Anthropic Claude",
    description: "Build robust AI agents for telemetry analysis and fault detection.",
    category: "AI",
    icon: Cpu,
    status: "Disconnected",
    isPro: true,
    color: "text-amber-700",
  },
  {
    id: "huggingface",
    name: "Hugging Face",
    description: "Access thousands of open-source ML models for aerospace physics.",
    category: "AI",
    icon: Layers,
    status: "Beta",
    isPro: true,
    color: "text-yellow-500",
  },

  // DevTools
  {
    id: "github",
    name: "GitHub",
    description: "Automate your flight software deployments with Actions.",
    category: "DevTools",
    icon: Github,
    status: "Connected",
    isPro: false,
    color: "text-slate-900",
  },
  {
    id: "docker",
    name: "Docker Hub",
    description: "Containerize and manage your aerospace microservices.",
    category: "DevTools",
    icon: Container,
    status: "Disconnected",
    isPro: true,
    color: "text-blue-600",
  },
  {
    id: "sentry",
    name: "Sentry",
    description: "Monitor and fix crashes in real-time across your fleet.",
    category: "DevTools",
    icon: Shield,
    status: "Disconnected",
    isPro: false,
    color: "text-purple-600",
  },

  // Communication
  {
    id: "slack",
    name: "Slack",
    description: "Receive rocket launch alerts and team updates in real-time.",
    category: "Communication",
    icon: Slack,
    status: "Disconnected",
    isPro: false,
    color: "text-[#4A154B]",
  },
  {
    id: "discord",
    name: "Discord",
    description: "Community management and bot integrations for mission control.",
    category: "Communication",
    icon: MessageSquare,
    status: "Disconnected",
    isPro: false,
    color: "text-[#5865F2]",
  },
  {
    id: "whatsapp",
    name: "WhatsApp API",
    description: "Direct telemetry alerts via secure enterprise messaging.",
    category: "Communication",
    icon: Share2,
    status: "Beta",
    isPro: true,
    color: "text-green-500",
  },

  // Aerospace
  {
    id: "nasa",
    name: "NASA Open API",
    description: "Access curated astronomical data and satellite imagery.",
    category: "Aerospace",
    icon: Rocket,
    status: "Connected",
    isPro: false,
    color: "text-blue-800",
  },
  {
    id: "spacex",
    name: "SpaceX API",
    description: "Latest launch schedules, core telemetry, and dragon data.",
    category: "Aerospace",
    icon: Satellite,
    status: "Beta",
    isPro: false,
    color: "text-slate-800",
  },
  {
    id: "celestrak",
    name: "CelesTrak",
    description: "Real-time orbital tracking and debris monitoring services.",
    category: "Aerospace",
    icon: Network,
    status: "Disconnected",
    isPro: true,
    color: "text-cyan-600",
  },

  // Finance
  {
    id: "stripe",
    name: "Stripe",
    description: "Handle subscriptions and payouts for your space agency.",
    category: "Finance",
    icon: CreditCard,
    status: "Disconnected",
    isPro: true,
    color: "text-[#635BFF]",
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Alternative payment processing for global mission funding.",
    category: "Finance",
    icon: CreditCard,
    status: "Disconnected",
    isPro: false,
    color: "text-blue-700",
  },

  // Marketing
  {
    id: "resend",
    name: "Resend",
    description: "Transactional emails for launch invites and user updates.",
    category: "Marketing",
    icon: Mail,
    status: "Connected",
    isPro: false,
    color: "text-black",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    description: "Manage newsletters and ground crew announcements.",
    category: "Marketing",
    icon: Mailbox,
    status: "Disconnected",
    isPro: false,
    color: "text-[#FFE01B]",
  },

  // Productivity
  {
    id: "notion",
    name: "Notion",
    description: "Organize documentation for flight protocols and checklists.",
    category: "Productivity",
    icon: Figma,
    status: "Disconnected",
    isPro: false,
    color: "text-black",
  },
  {
    id: "jira",
    name: "Jira",
    description: "Track engineering issues and rocket assembly progress.",
    category: "Productivity",
    icon: Target,
    status: "Disconnected",
    isPro: true,
    color: "text-blue-600",
  },
];
