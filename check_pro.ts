
import "dotenv/config";
import { db } from "./database";
import { pro_members } from "./database/schema";

console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);


async function checkProMembers() {
  try {
    const members = await db.select().from(pro_members);
    console.log("Pro Members:", JSON.stringify(members, null, 2));
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkProMembers();
