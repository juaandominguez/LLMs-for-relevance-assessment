import docs_db from "@/data/docs_db.json";
import { createPair } from "./queries";

const populateDocs = async () => {
  try {
    for (const pair of docs_db) {
      await createPair(
        pair.pair_id,
        parseInt(pair.query_id),
        pair.query_title,
        pair.query_description,
        pair.query_narrative,
        pair.doc_id,
        pair.document,
        parseInt(pair.original_relevance),
        parseInt(pair.llm_relevance)
      );
    }
  } catch (e) {
    console.error("Error populating docs:", e);
    throw e;
  }
};

populateDocs();
