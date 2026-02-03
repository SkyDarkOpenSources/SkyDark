import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { isEmployee } from "../../../../lib/actions/pro.action";
import SearchPageClient from "./SearchClient";

export default async function SearchPage() {
  const user = await currentUser();
  if (!user) {
    notFound();
  }

  const userEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress || user.emailAddresses[0]?.emailAddress || "";
  
  const isUserEmployee = await isEmployee(userEmail);

  if (!isUserEmployee) {
    notFound();
  }

  return <SearchPageClient />;
}
