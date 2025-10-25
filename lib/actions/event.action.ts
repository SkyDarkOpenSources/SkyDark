"use server";

import { eq } from "drizzle-orm";
import { events ,Event } from "../../database/schema";
import { db } from "../../database/index";
import { revalidatePath } from "next/cache";

export const getEvent = async (id: string): Promise<Event | null> => {
  const club = await db.select().from(events).where(eq(events.id, id)).limit(1);
  return club.length > 0 ? club[0] : null;
};

export const createEvent = async (name: string, description: string, image: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.insert(events).values({
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

export const deleteEvent = async (id: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.delete(events).where(eq(events.id, id));
    revalidatePath('/dashboard/clubs');
    return { success: true };
  } catch (error) {
    console.error('Error deleting club:', error);
    return { success: false, error: error as Error };
  }
};

export const updateEvent = async (id: string, name: string, description: string, image: string): Promise<{ success: boolean; error?: Error }> => {
  try {
    await db.update(events).set({    
        name,
        description,
        image,
    }).where(eq(events.id, id));
    revalidatePath('/dashboard/clubs');
    return { success: true };
  } catch (error) {
    console.error('Error updating club:', error);
    return { success: false, error: error as Error };
  }     
};

export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const allClubs = await db.select().from(events);
    return allClubs;
    } catch (error) {       
    console.error('Error fetching clubs:', error);
    return [];
  }
};

export const getEventByName = async (name: string): Promise<Event | null> => {
  const club = await db.select().from(events).where(eq(events.name, name)).limit(1);
  return club.length > 0 ? club[0] : null;
};