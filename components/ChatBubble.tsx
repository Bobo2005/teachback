
import { ChatMessage } from '@/lib/types';

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  if (isUser) {
    return (
      <div className="flex justify-end mb-8 w-full">
        <div className="bg-paper text-ink font-body text-base md:text-lg p-5 rounded shadow-lg max-w-[85%] md:max-w-[70%]">
          {message.content}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex justify-start mb-8 w-full">
      <div className="font-annotation text-chalkWhite text-3xl md:text-4xl max-w-[90%] md:max-w-[80%] leading-relaxed -rotate-1">
        {message.content}
      </div>
    </div>
  );
}