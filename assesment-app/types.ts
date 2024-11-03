export type Topic = {
  id: number;
  title: string;
  description: string;
  narrative: string;
};

export type Pair = {
  id: number;
  topicId: number;
  documentId: string;
};
