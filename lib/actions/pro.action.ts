// lib/actions/pro.action.ts
'use server';

import { db } from "../../database";
import { pro_members } from "../../database/schema";
import { eq } from "drizzle-orm";

export async function addProMember(email: string) {
  try {
    const existing = await db.select().from(pro_members).where(eq(pro_members.email, email));
    if (existing.length === 0) {
      await db.insert(pro_members).values({ email });
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding pro member', error);
    return { success: false, error };
  }
}

export async function isProMember(email: string) {
  try {
    const rows = await db.select().from(pro_members).where(eq(pro_members.email, email));
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking pro member', error);
    return false;
  }
}
