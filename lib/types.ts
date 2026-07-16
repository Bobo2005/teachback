export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClearPoint = {
  point: string;
  quote: string;
};

export type Gap = {
  issue: string;
  quote: string;
  suggestion: string;
};

export type UnderstandingReport = {
  topic: string;
  overallScore: number;
  clearPoints: ClearPoint[];
  gaps: Gap[];
  reviewSuggestions: string[];
};


// TODO: flesh this out in a later step — this will capture how well the
// user's explanation covered the topic, what gaps the AI caught, etc.
// TODO: topic: string;
// TODO: coverageScore: number;
// TODO: gaps: string[];
// TODO: strengths: string[];
// TODO: summary: string;

