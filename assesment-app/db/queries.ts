import { and, count, desc, eq } from "drizzle-orm";
import { db, users, assessments, pairs, queries, documents } from "./schema";

const GUEST_ROLE = "guest";
const BASIC_ROLE = "basic";

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
        role: BASIC_ROLE,
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
        role: GUEST_ROLE,
      })
      .returning();

    return user[0];
  } catch (e) {
    console.error("Error creating guest user:", e);
    throw e;
  }
};

export const getAssessment = async (userId: string, pairId: number) => {
  const assesment = await db
    .select()
    .from(assessments)
    .where(and(eq(assessments.userId, userId), eq(assessments.pairId, pairId)));

  if (!assesment) {
    return null;
  }
  return assesment[0];
};

export const createAssessment = async (
  userId: string,
  pairId: number,
  value: number
) => {
  try {
    const assessment = await db
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
    return assessment[0] || getAssessment(userId, pairId);
  } catch (e) {
    console.error("Error creating assessment:", e);
    throw e;
  }
};

export const getGroupedAssessments = async () => {
  const ret = await db
    .select({
      pairId: assessments.pairId,
      value: assessments.value,
      count: count(assessments.value),
    })
    .from(assessments)
    .groupBy(assessments.pairId, assessments.value)
    .orderBy(assessments.pairId);

  return ret;
};

export const getAllAssesmentsByUser = async (userId: string) => {
  const assesments = await db
    .select()
    .from(assessments)
    .where(eq(assessments.userId, userId));

  return assesments;
};

export const createQuery = async (
  id: number,
  title: string,
  description: string,
  narrative: string
) => {
  const pair = await db
    .insert(queries)
    .values([
      {
        id,
        title,
        description,
        narrative,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .onConflictDoUpdate({
      target: [pairs.id],
      set: {
        id,
        title,
        description,
        narrative,
        updatedAt: new Date(),
      },
    })
    .returning();

  return pair[0];
};

export const createDocument = async (id: string, text: string) => {
  const document = await db
    .insert(documents)
    .values([
      {
        id,
        text,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .onConflictDoUpdate({
      target: [documents.id],
      set: {
        id,
        text,
        updatedAt: new Date(),
      },
    })
    .returning();

  return document[0];
};

export const createPair = async (
  pairId: number,
  queryId: number,
  documentId: string,
  originalRelevance: number,
  llmRelevance: number
) => {
  const pair = await db
    .insert(pairs)
    .values([
      {
        id: pairId,
        queryId,
        documentId,
        originalRelevance,
        llmRelevance,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ])
    .onConflictDoUpdate({
      target: [pairs.id],
      set: {
        queryId,
        documentId,
        originalRelevance,
        llmRelevance,
        updatedAt: new Date(),
      },
    })
    .returning();

  return pair[0];
};

export const getAllPairs = async () => {
  const allPairs = (
    await db
      .select({
        id: pairs.id,
        queryTitle: queries.title,
        queryId: pairs.queryId,
        originalRelevance: pairs.originalRelevance,
        llmRelevance: pairs.llmRelevance,
      })
      .from(pairs)
      .leftJoin(queries, eq(pairs.queryId, queries.id))
  ).sort((a, b) => a.id - b.id);

  return allPairs;
};

export const getLastAssessmentFromUser = async (userId: string) => {
  const lastAssessment = await db
    .select()
    .from(assessments)
    .where(eq(assessments.userId, userId))
    .orderBy(desc(assessments.updatedAt))
    .limit(1);

  return lastAssessment[0]?.pairId || 0;
};

export const getUserRole = async (userId: string) => {
  const user = await db
    .select({
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user[0]?.role || null;
};
