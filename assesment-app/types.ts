export type Topic = {
  title: string;
  description: string;
  narrative: string;
};

export type Pair = {
  id: number;
  topicId: number;
  documentId: string;
};

export type Comparison = {
  pair: string;
  golden: number;
  llm: number;
};
