import { and, eq } from "drizzle-orm";
import { db, users, assessments } from "./schema";

export const getUser = async (email: string) => {
  const user = await db.select().from(users).where(eq(users.email, email));

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
        isGuest: false,
      })
      .onConflictDoNothing()
      .returning();

    console.log(user);

    return user[0] || (await getUser(email));
  } catch (e) {
    console.error("Error creating user:", e);
    throw e;
  }
};

export const createGuestUser = async () => {
  try {
    const user = await db
      .insert(users)
      .values({
        isGuest: true,
      })
      .returning();

    return user[0];
  } catch (e) {
    console.error("Error creating guest user:", e);
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

    const currentLastAssessment = await db
      .select({ lastAssessment: users["lastAssessment"] })
      .from(users)
      .where(eq(users.id, userId));

    if (!currentLastAssessment[0].lastAssessment) {
      await db
        .update(users)
        .set({
          lastAssessment: pairId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else if (currentLastAssessment[0].lastAssessment < pairId) {
      await db
        .update(users)
        .set({
          lastAssessment: pairId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    }
    return assesment[0] || getAssesment(userId, pairId);
  } catch (e) {
    console.error("Error creating assessment:", e);
    throw e;
  }
};
