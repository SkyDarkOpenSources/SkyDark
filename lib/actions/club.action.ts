"use server";

import { eq } from "drizzle-orm";
import { clubs } from "../../database/schema";
import { db } from "../../database/index";
import { revalidatePath } from "next/cache";
import { Club } from "../../database/schema";

export const getClub = async (id: string): Promise<Club | null> => {
  const club = await db.select().from(clubs).where(eq(clubs.id, id)).limit(1);
  return club.length > 0 ? club[0] : null;
};

export const createClub = async (name: string, description: string, image: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.insert(clubs).values({
        name,
        description,
        image,
        members: 0, // Initialize members count to 0
    });
    revalidatePath('/dashboard/clubs');
    return { success: true };
  } catch (error) {
    console.error('Error creating club:', error);
    return { success: false, error: error as Error };
  }
};

export const deleteClub = async (id: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.delete(clubs).where(eq(clubs.id, id));
    revalidatePath('/dashboard/clubs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting club:', error);
    return { success: false, error: error as Error };
  }
};

export const updateClub = async (id: string, name: string, description: string, image: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.update(clubs).set({    
        name,
        description,
        image,
    }).where(eq(clubs.id, id));
    revalidatePath('/dashboard/clubs');
    return { success: true };
  } catch (error) {
    console.error('Error updating club:', error);
    return { success: false, error: error as Error };
  }     
};

export const getAllClubs = async (): Promise<Club[]> => {
  try {
    const allClubs = await db.select().from(clubs);
    return allClubs;
    } catch (error) {       
    console.error('Error fetching clubs:', error);
    return [];
  }
};

export const getClubByName = async (name: string): Promise<Club | null> => {
  const club = await db.select().from(clubs).where(eq(clubs.name, name)).limit(1);
  return club.length > 0 ? club[0] : null;
};