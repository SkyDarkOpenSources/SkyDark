
import "dotenv/config";
import { db } from "./database";
import { pro_members, employees } from "./database/schema";
import { isProMember, isEmployee } from "./lib/actions/pro.action";
import { eq } from "drizzle-orm";

async function runVerification() {
  const testEmailPro = "pro_tester@skydark.com";
  const testEmailEmployee = "employee_tester@skydark.com";
  const testEmailNone = "normal_user@gmail.com";

  try {
    console.log("--- SkyDark Logic Verification ---");

    // 1. Cleanup existing test data
    await db.delete(pro_members).where(eq(pro_members.email, testEmailPro));
    await db.delete(employees).where(eq(employees.email, testEmailEmployee));

    // 2. Setup test data
    console.log("Setting up test data...");
    await db.insert(pro_members).values({ email: testEmailPro });
    await db.insert(employees).values({ email: testEmailEmployee });

    // 3. Test isProMember
    console.log("\nTesting isProMember logic (Both should be true):");
    
    const isPro1 = await isProMember(testEmailPro);
    console.log(`Pro member email (${testEmailPro}): ${isPro1 ? "PASS (Premium)" : "FAIL (Not Premium)"}`);

    const isPro2 = await isProMember(testEmailEmployee);
    console.log(`Employee email (${testEmailEmployee}): ${isPro2 ? "PASS (Premium)" : "FAIL (Not Premium)"}`);

    // 4. Test isEmployee
    console.log("\nTesting isEmployee logic (Only employee should be true):");

    const isEmp1 = await isEmployee(testEmailPro);
    console.log(`Pro member email (${testEmailPro}) is employee: ${!isEmp1 ? "PASS (No)" : "FAIL (Yes)"}`);

    const isEmp2 = await isEmployee(testEmailEmployee);
    console.log(`Employee email (${testEmailEmployee}) is employee: ${isEmp2 ? "PASS (Yes)" : "FAIL (No)"}`);

    const isEmp3 = await isEmployee(testEmailNone);
    console.log(`Normal email (${testEmailNone}) is employee: ${!isEmp3 ? "PASS (No)" : "FAIL (Yes)"}`);

    // 5. Cleanup
    console.log("\nCleaning up test data...");
    await db.delete(pro_members).where(eq(pro_members.email, testEmailPro));
    await db.delete(employees).where(eq(employees.email, testEmailEmployee));

    console.log("\n--- Verification Finished ---");
    process.exit(0);
  } catch (err) {
    console.error("Verification failed:", err);
    process.exit(1);
  }
}

runVerification();

