import topics from "../data/topics.json";
import documents from "../data/documents.json";
export const getTopicAndDocument = (topicId: number, documentId: string) => {
  const topic = topics.find((topic) => topic.id === topicId);
  const doc = documents.find((document) => document.id === documentId);
  if (!topic) {
    throw new Error(`Topic with id ${topicId} not found`);
  }
  if (!doc) {
    throw new Error(`Document with id ${documentId} not found`);
  }
  const docHtml = doc.html;
  return { topic, docHtml };
};
