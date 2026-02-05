import { currentUser } from "@clerk/nextjs/server";
import { isProMember } from "../../../../lib/actions/pro.action";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CloudStorageClient from "./CloudStorageClient";

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
              Upgrade your account to unlock professional cloud storage with AWS, Azure, and 20+ other integrations.
            </p>
            <Link href="/premium">
              <Button className="w-full">Upgrade to Pro</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <CloudStorageClient />;
}

