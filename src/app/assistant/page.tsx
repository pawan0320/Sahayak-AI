'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, Mic } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI Teaching Assistant. I can help you with lesson planning, student performance insights, classroom management strategies, and more. What would you like help with today?',
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I understand you're asking about "${input}". Based on your class data, I can suggest personalized strategies to help with this. Would you like me to provide specific recommendations?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <div className="flex-1 flex flex-col">
        <Header title="AI Teaching Assistant" />

        <main className="flex-1 flex flex-col p-6 overflow-hidden">
          <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
            {/* Chat Container */}
            <div className="flex-1 overflow-y-auto mb-6 space-y-4">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-primary to-accent text-foreground rounded-br-none'
                        : 'bg-card border border-border text-foreground rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.role === 'user' ? 'text-foreground/70' : 'text-muted-foreground'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="bg-card border border-border px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input Area */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              {/* Quick Suggestions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  'Improve lesson plan',
                  'Student performance tips',
                  'Behavior management',
                  'Assessment ideas',
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="text-xs p-2 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary/50 transition text-left"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>

              {/* Input Field */}
              <Card className="p-4 border-border/50 flex items-end gap-3">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about your classroom..."
                  className="flex-1 resize-none bg-transparent text-foreground placeholder-muted-foreground focus:outline-none max-h-24 scrollbar-hide"
                  rows={2}
                />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-secondary rounded-full"
                    disabled={isLoading}
                  >
                    <Mic className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 rounded-full"
                    size="icon"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </Card>

              <p className="text-xs text-muted-foreground text-center">
                AI Assistant is here to help with your teaching journey
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
