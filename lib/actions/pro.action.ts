// lib/actions/pro.action.ts
'use server';

import { db } from "../../database";
import { pro_members, employees } from "../../database/schema";
import { eq } from "drizzle-orm";

export async function addProMember(email: string) {
  try {
    const normalizedEmail = email.toLowerCase();
    const existing = await db.select().from(pro_members).where(eq(pro_members.email, normalizedEmail));
    if (existing.length === 0) {
      await db.insert(pro_members).values({ email: normalizedEmail });
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding pro member', error);
    return { success: false, error };
  }
}

export async function isProMember(email: string) {
  try {
    const normalizedEmail = email.toLowerCase();
    
    // Check if user is in pro_members table
    const proRows = await db.select().from(pro_members).where(eq(pro_members.email, normalizedEmail));
    if (proRows.length > 0) return true;

    // Check if user is in employees table
    const employeeRows = await db.select().from(employees).where(eq(employees.email, normalizedEmail));
    if (employeeRows.length > 0) return true;

    return false;
  } catch (error) {
    console.error('Error checking pro member status', error);
    return false;
  }
}

export async function isEmployee(email: string) {
  try {
    const normalizedEmail = email.toLowerCase();
    const rows = await db.select().from(employees).where(eq(employees.email, normalizedEmail));
    return rows.length > 0;
  } catch (error) {
    console.error('Error checking employee status', error);
    return false;
  }
}
