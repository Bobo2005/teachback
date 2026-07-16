

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface UnderstandingReport {
  // TODO: Flesh out specific scoring, missing concepts, and feedback fields
  id?: string;
  topic?: string;
}