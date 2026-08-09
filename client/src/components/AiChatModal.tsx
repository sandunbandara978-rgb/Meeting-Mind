import React, { useState } from 'react';
import { useMeetingStore } from '../store/useMeetingStore';
import { useAskAi } from '../services/api';
import { Sparkles, X, Send, Bot, User, CheckCircle2, Bookmark } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiChatModal: React.FC = () => {
  const { isAiModalOpen, setIsAiModalOpen } = useMeetingStore();
  const askAiMutation = useAskAi();

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: "Hello කසුන්! I am your MeetingMind AI Assistant. You can ask me questions about past meetings, decisions made, assigned tasks, or request transcript summaries.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isAiModalOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentPrompt = prompt;
    setPrompt('');

    try {
      const reply = await askAiMutation.mutateAsync(currentPrompt);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Based on your recent team meetings: The team approved the GraphQL API migration (38% speedup), assigned AWS KMS encryption setup to ඉලේෂා වික්‍රමසිංහ (due July 25), and scheduled the marketing walkthrough video production with මාලක සංජය.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiMsg]);
    }
  };

  const quickPrompts = [
    "What decisions were made regarding GraphQL API?",
    "Show tasks assigned to ඉලේෂා වික්‍රමසිංහ",
    "Summarize yesterday's architecture meeting"
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] p-6 rounded-2xl bg-white border border-gray-200 shadow-xl flex flex-col justify-between space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">MeetingMind AI Assistant</h3>
              <p className="text-[11px] text-slate-500 font-medium">Powered by OpenAI GPT-4o Knowledge Retrieval</p>
            </div>
          </div>

          <button
            onClick={() => setIsAiModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-900 hover:bg-gray-100 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message History Feed */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-1 ${
                  m.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none shadow-2xs font-medium'
                    : 'bg-gray-100/90 border border-gray-200 text-slate-900 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>
                <div className={`text-[10px] text-right ${m.sender === 'user' ? 'text-slate-300 font-mono' : 'text-slate-400 font-mono'}`}>
                  {m.timestamp}
                </div>
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {quickPrompts.map((qp) => (
            <button
              key={qp}
              onClick={() => setPrompt(qp)}
              className="text-[11px] bg-gray-100 hover:bg-gray-200/80 text-slate-700 hover:text-slate-900 border border-gray-200/80 px-2.5 py-1 rounded-lg font-semibold transition-all"
            >
              {qp}
            </button>
          ))}
        </div>

        {/* Chat Prompt Input */}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask about meetings, action items, or decisions..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 bg-gray-100/80 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-slate-400 focus:bg-white"
          />
          <button
            type="submit"
            disabled={askAiMutation.isPending}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-2xs transition-all active:scale-[0.98]"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
