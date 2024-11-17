import docs_db from "@/data/docs_db.json";
export const getTopicAndDocument = (pairId: number) => {
  const pair = docs_db.find((doc) => doc.pair_id === pairId);
  if (!pair) {
    throw new Error(`Pair with id ${pairId} not found`);
  }
  const doc = pair.document;
  const topic = {
    title: pair.query_title,
    description: pair.query_description,
    narrative: pair.query_narrative,
  };

  return { topic, doc };
};
