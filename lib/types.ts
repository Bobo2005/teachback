

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UnderstandingReport {
  topic: string;
  overallScore: number;
  clearPoints: Array<{
    point: string;
    quote: string;
  }>;
  gaps: Array<{
    issue: string;
    quote: string;
    suggestion: string;
  }>;
  reviewSuggestions: string[];
}