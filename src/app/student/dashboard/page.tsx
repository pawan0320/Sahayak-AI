'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, Book, Send, X, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StudentDashboardHeader } from '@/components/student/StudentDashboardHeader';
import { StudentDashboardNotes } from '@/components/student/StudentDashboardNotes';
import { StudentDashboardAnalytics } from '@/components/student/StudentDashboardAnalytics';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export default function StudentDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'notes' | 'analytics'>('overview');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! 👋 I\'m your AI learning assistant. Ask me anything about your lessons, notes, or need help with concepts. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Mock student data
  const studentData = {
    name: 'Raj Kumar',
    grade: '5',
    schoolName: 'Green Valley School',
    className: '5-A',
    schoolId: 'school-1',
    classId: 'class-5a',
  };

  const todayLesson = {
    topic: 'Fractions and Decimals',
    time: '10:00 AM',
    status: 'completed' as const,
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponses = [
        'That\'s a great question! Let me explain it with an example...',
        'Based on your recent notes, here\'s what you need to know: Fractions represent parts of a whole. When adding fractions, you need a common denominator.',
        'This concept is important because it helps you solve real-world problems like dividing resources or calculating measurements.',
        'Your teacher covered this in today\'s class. Would you like me to summarize the key points?',
        'I notice you\'ve been doing well in this topic based on your quiz scores. The key is consistent practice.',
        'Here\'s a rural example to help you understand: If you have 10 acres of farm land and divide it among 4 brothers, each gets 2.5 acres, which is 2 and 1/2 acres.',
      ];

      const aiMessage: Message = {
        id: `msg-${Date.now() + 1}`,
        type: 'ai',
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Header */}
        <StudentDashboardHeader
          studentName={studentData.name}
          grade={studentData.grade}
          schoolName={studentData.schoolName}
          className={studentData.className}
          todayLesson={todayLesson}
        />

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-2 border-b border-border/50 overflow-x-auto pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {[
            { id: 'overview', label: '📊 Overview', icon: '📊' },
            { id: 'notes', label: '📚 AI Notes', icon: '📚' },
            { id: 'analytics', label: '📈 Analytics', icon: '📈' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-3 font-semibold text-sm border-b-2 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Quick Access Section */}
              <div>
                <h2 className="text-2xl font-bold mb-4">🎯 Quick Access</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      title: 'Latest Class Notes',
                      icon: '📝',
                      desc: 'Review today\'s AI-generated notes',
                      color: 'primary',
                    },
                    {
                      title: 'Practice Quiz',
                      icon: '✏️',
                      desc: 'Test your understanding',
                      color: 'accent',
                    },
                    {
                      title: 'Ask AI Tutor',
                      icon: '🤖',
                      desc: 'Get personalized help instantly',
                      color: 'success',
                    },
                  ].map((item, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border border-border/50 bg-gradient-to-br from-${item.color}/5 to-transparent hover:shadow-lg transition text-left group`}
                      onClick={() => {
                        if (item.title === 'Ask AI Tutor') setIsAIChatOpen(true);
                        if (item.title === 'Latest Class Notes') setActiveTab('notes');
                      }}
                    >
                      <p className="text-2xl mb-2">{item.icon}</p>
                      <p className="font-semibold text-sm">{item.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
                      <motion.div
                        className="mt-3 w-2 h-2 rounded-full bg-current opacity-0 group-hover:opacity-100 transition"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Recent Notes Preview */}
              <div>
                <h2 className="text-2xl font-bold mb-4">📚 Recent Notes</h2>
                <StudentDashboardNotes
                  schoolId={studentData.schoolId}
                  classId={studentData.classId}
                  studentGrade={studentData.grade}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StudentDashboardNotes
                schoolId={studentData.schoolId}
                classId={studentData.classId}
                studentGrade={studentData.grade}
              />
            </motion.div>
          )}

          {activeTab === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <StudentDashboardAnalytics
                studentGrade={studentData.grade}
                quizHistory={[]}
                attendance={[]}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Chat Button */}
      <motion.button
        onClick={() => setIsAIChatOpen(!isAIChatOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg hover:shadow-xl transition flex items-center justify-center text-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        {isAIChatOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquare className="w-6 h-6" />
        )}
      </motion.button>

      {/* AI Chat Modal */}
      <AnimatePresence>
        {isAIChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-96 max-h-[calc(100vh-8rem)] rounded-2xl border border-border/50 bg-gradient-to-br from-background to-secondary/10 shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="font-bold">AI Learning Assistant</h3>
              </div>
              <p className="text-xs text-muted-foreground">Ask me anything about your lessons</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                      msg.type === 'user'
                        ? 'bg-primary text-white'
                        : 'bg-secondary/50 text-foreground border border-border/50'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-2"
                >
                  <Loader className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-xs text-muted-foreground">AI is thinking...</span>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSendMessage}
              className="border-t border-border/50 px-4 py-3 flex gap-2"
            >
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 rounded-lg border border-border/50 bg-secondary/30 text-sm focus:border-primary focus:outline-none transition"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-white h-auto"
                disabled={isLoading || !inputMessage.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
