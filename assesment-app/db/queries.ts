import { and, eq } from "drizzle-orm";
import { db, users, assessments } from "./schema";

export const getUser = async (email: string, password: string) => {
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)));

  if (!user) {
    return null;
  }
  return user[0];
};

export const createUser = async (email: string, password: string) => {
  try {
    const user = await db
      .insert(users)
      .values({
        email,
        password,
      })
      .onConflictDoNothing()
      .returning();

    return user[0] || (await getUser(email, password));
  } catch (e) {
    console.error("Error creating user:", e);
    throw e;
  }
};

export const getAssesment = async (userId: string, pairId: number) => {
  const assesment = await db
    .select()
    .from(assessments)
    .where(and(eq(assessments.userId, userId), eq(assessments.pairId, pairId)));

  if (!assesment) {
    return null;
  }
  return assesment[0];
};

export const createAssesment = async (
  userId: string,
  pairId: number,
  value: number
) => {
  try {
    const assesment = await db
      .insert(assessments)
      .values({
        userId,
        pairId,
        value,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [assessments.userId, assessments.pairId],
        set: {
          value,
          updatedAt: new Date(),
        },
      })
      .returning();
    return assesment[0] || getAssesment(userId, pairId);
  } catch (e) {
    console.error("Error creating assessment:", e);
    throw e;
  }
};
