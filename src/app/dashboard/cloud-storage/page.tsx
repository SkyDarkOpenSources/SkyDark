import { currentUser } from "@clerk/nextjs/server";
import { isProMember } from "../../../../lib/actions/pro.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cloud, Lock, Server, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CloudStoragePage() {
  const user = await currentUser();
  const userEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user?.emailAddresses[0]?.emailAddress || "";
  const userIsPro = userEmail ? await isProMember(userEmail) : false;

  if (!userIsPro) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full border-dashed border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Premium Feature</CardTitle>
            <CardDescription>
              SkyDark Cloud Storage is only available for Pro members.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Upgrade your account to unlock professional cloud storage with AWS and Azure integration.
            </p>
            <Link href="/premium">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-background">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cloud Storage</h1>
          <p className="text-muted-foreground">Manage your cloud infrastructure and projects</p>
        </div>
        <div className="px-3 py-1 bg-primary/10 rounded-full text-primary text-xs font-bold uppercase tracking-wider">
          Pro Member
        </div>
      </div>

      <Card className="w-full bg-gradient-to-br from-primary/5 via-background to-background border-primary/20">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Welcome to SkyDark Cloud Storage</CardTitle>
              <CardDescription>
                Unified control plane for your aerospace cloud infrastructure.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 mt-4">
            <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <Server className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-lg">AWS Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your Amazon Web Services account to manage S3 buckets, EC2 instances, and Lambda functions for rocket telemetry and simulation.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                Connect AWS
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-sky-500" />
                <h3 className="font-semibold text-lg">Azure Integration</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Seamlessly link with Microsoft Azure for high-performance computing, aerospace IoT hubs, and cloud-native databases.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                Connect Azure
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-5 w-5 rounded bg-[#00e599]/20">
                   <div className="h-3 w-3 rounded-full bg-[#00e599]" />
                </div>
                <h3 className="font-semibold text-lg">Neon Postgres</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Connect your serverless Neon database. Scale to zero when not in use and manage your aerospace data with ease.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                Connect Neon
              </Button>
            </div>

            <div className="p-6 rounded-xl border bg-card/50 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center h-5 w-5 rounded bg-orange-500/20">
                   <div className="h-3 w-3 rounded-sm bg-orange-500 rotate-45" />
                </div>
                <h3 className="font-semibold text-lg">CDN & Edge Storage</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Deploy assets closer to your ground stations using global CDN and edge storage for ultra-low latency telemetry.
              </p>
              <Button variant="outline" size="sm" className="w-full mt-2" disabled>
                Configure CDN
              </Button>
            </div>

          </div>
          
          <div className="mt-8 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-xs text-muted-foreground">
              Note: Cloud integration features are currently being deployed. Backend configuration will be available in the next release.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
