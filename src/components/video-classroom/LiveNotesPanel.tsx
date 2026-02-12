'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Copy, Bookmark, CheckCircle, AlertCircle, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ClassNote {
  id: string;
  title: string;
  content: string;
  type: 'keypoint' | 'question' | 'doubt' | 'correction' | 'example';
  timestamp: Date;
  studentName?: string;
}

interface LiveNotesPanelProps {
  notes: ClassNote[];
  topic: string;
  keyPoints: string[];
  homework: string[];
  onNoteBookmark?: (noteId: string) => void;
}

export function LiveNotesPanel({
  notes,
  topic,
  keyPoints,
  homework,
  onNoteBookmark,
}: LiveNotesPanelProps) {
  const [activeTab, setActiveTab] = useState<'notes' | 'keypoints' | 'homework'>('notes');
  const [copied, setCopied] = useState(false);
  const [bookmarkedNotes, setBookmarkedNotes] = useState<Set<string>>(new Set());

  const handleCopyAll = () => {
    const text = generateFullTranscript();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBookmark = (noteId: string) => {
    setBookmarkedNotes((prev) => {
      const updated = new Set(prev);
      if (updated.has(noteId)) updated.delete(noteId);
      else updated.add(noteId);
      return updated;
    });
    onNoteBookmark?.(noteId);
  };

  const handleDownload = (format: 'txt' | 'pdf') => {
    const text = generateFullTranscript();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', `${topic}-notes.${format === 'txt' ? 'txt' : 'pdf'}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const generateFullTranscript = (): string => {
    let transcript = `╔════════════════════════════════════════╗\n`;
    transcript += `║  CLASS NOTES: ${topic.toUpperCase().padEnd(36)}  ║\n`;
    transcript += `╚════════════════════════════════════════╝\n\n`;

    transcript += `📚 KEY POINTS\n`;
    transcript += `─────────────────────────────────────────\n`;
    keyPoints.forEach((point, i) => {
      transcript += `${i + 1}. ${point}\n`;
    });

    transcript += `\n📝 CLASS NOTES\n`;
    transcript += `─────────────────────────────────────────\n`;
    notes.forEach((note) => {
      transcript += `[${note.type.toUpperCase()}] ${note.title}\n`;
      transcript += `${note.content}\n`;
      if (note.studentName) transcript += `(Student: ${note.studentName})\n`;
      transcript += `\n`;
    });

    transcript += `\n📌 HOMEWORK\n`;
    transcript += `─────────────────────────────────────────\n`;
    homework.forEach((task, i) => {
      transcript += `☐ ${i + 1}. ${task}\n`;
    });

    return transcript;
  };

  const getNoteIcon = (type: string) => {
    switch (type) {
      case 'keypoint':
        return '⭐';
      case 'question':
        return '❓';
      case 'doubt':
        return '🤔';
      case 'correction':
        return '✏️';
      case 'example':
        return '💡';
      default:
        return '📌';
    }
  };

  return (
    <motion.div
      className="h-full rounded-xl border border-border/50 bg-gradient-to-br from-background to-secondary/10 overflow-hidden flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="px-4 py-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Live Notes</h3>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload('txt')}
              className="text-xs h-auto py-1 px-2"
              title="Download as text"
            >
              <Download className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCopyAll}
              className={`text-xs h-auto py-1 px-2 transition ${copied ? 'text-success' : ''}`}
              title="Copy all"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {(['notes', 'keypoints', 'homework'] as const).map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab
                  ? 'bg-primary text-white'
                  : 'bg-secondary/40 text-muted-foreground hover:bg-secondary/60'
              }`}
              layout
            >
              {tab === 'notes'
                ? `Notes (${notes.length})`
                : tab === 'keypoints'
                  ? `Key Points (${keyPoints.length})`
                  : `Homework (${homework.length})`}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        <AnimatePresence mode="wait">
          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <motion.div
              key="notes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {notes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Notes will appear as lesson progresses...</p>
                </div>
              ) : (
                notes.map((note, index) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-secondary/20 border border-border/50 hover:border-primary/50 group transition"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-lg flex-shrink-0">{getNoteIcon(note.type)}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{note.title}</p>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-1">
                          {note.content}
                        </p>
                        {note.studentName && (
                          <p className="text-xs text-accent mt-1">👤 {note.studentName}</p>
                        )}
                      </div>
                      <motion.button
                        onClick={() => handleBookmark(note.id)}
                        className={`flex-shrink-0 p-1.5 rounded transition opacity-0 group-hover:opacity-100 ${
                          bookmarkedNotes.has(note.id)
                            ? 'bg-primary/20 text-primary'
                            : 'bg-secondary/40 text-muted-foreground'
                        }`}
                        whileHover={{ scale: 1.1 }}
                      >
                        <Bookmark className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Key Points Tab */}
          {activeTab === 'keypoints' && (
            <motion.div
              key="keypoints"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {keyPoints.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Key points will be generated...</p>
                </div>
              ) : (
                keyPoints.map((point, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-primary/10 border border-primary/30 group hover:border-primary/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed flex-1">{point}</p>
                      <motion.button
                        onClick={() => handleBookmark(`kp-${index}`)}
                        className="flex-shrink-0 p-1.5 rounded transition opacity-0 group-hover:opacity-100 bg-secondary/40 text-muted-foreground hover:text-primary"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Copy className="w-3 h-3" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Homework Tab */}
          {activeTab === 'homework' && (
            <motion.div
              key="homework"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {homework.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Homework will be generated after class...</p>
                </div>
              ) : (
                homework.map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-3 rounded-lg bg-accent/10 border border-accent/30 group hover:border-accent/50 transition"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border border-accent/50 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground leading-relaxed">{task}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 px-4 py-3 bg-secondary/5">
        <p className="text-xs text-muted-foreground text-center">
          📌 Auto-generated during class • 💾 Save for later review
        </p>
      </div>
    </motion.div>
  );
}
