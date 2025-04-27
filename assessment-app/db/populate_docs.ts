import docs_db from "@/data/docs_db.json";
import { createPair, createQuery, createDocument } from "./queries";

const populateDocs = async () => {
  try {
    for (const pair of docs_db) {
      await createQuery(
        parseInt(pair.query_id),
        pair.query_title,
        pair.query_description,
        pair.query_narrative
      );
      await createDocument(pair.doc_id, pair.document);
      await createPair(
        pair.pair_id,
        parseInt(pair.query_id),
        pair.doc_id,
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
