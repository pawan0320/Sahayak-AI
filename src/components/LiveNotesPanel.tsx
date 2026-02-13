'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Download, Copy, Maximize2, X } from 'lucide-react';

interface Note {
  id: string;
  type: 'keypoint' | 'definition' | 'example' | 'question' | 'doubt' | 'correction';
  content: string;
  timestamp: Date;
  studentName?: string;
}

interface LiveNotesPanelProps {
  notes?: Note[];
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export function LiveNotesPanel({
  notes = [],
  isExpanded = false,
  onToggleExpand = () => {},
}: LiveNotesPanelProps) {
  const [copied, setCopied] = useState(false);

  const typeIcons: Record<string, string> = {
    keypoint: '⭐',
    definition: '📖',
    example: '🔍',
    question: '❓',
    doubt: '🤔',
    correction: '✏️',
  };

  const typeColors: Record<string, string> = {
    keypoint: 'bg-primary/10 border-primary/30 text-primary',
    definition: 'bg-accent/10 border-accent/30 text-accent',
    example: 'bg-success/10 border-success/30 text-success',
    question: 'bg-warning/10 border-warning/30 text-warning',
    doubt: 'bg-secondary/10 border-secondary/30 text-secondary',
    correction: 'bg-destructive/10 border-destructive/30 text-destructive',
  };

  const exportNotes = () => {
    const notesText = notes
      .map((note) => `[${note.type.toUpperCase()}] ${note.content}${note.studentName ? ` - ${note.studentName}` : ''}`)
      .join('\n\n');

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(notesText));
    element.setAttribute('download', `class-notes-${new Date().toISOString()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const copyAllNotes = () => {
    const notesText = notes
      .map((note) => `[${note.type}] ${note.content}`)
      .join('\n\n');

    navigator.clipboard.writeText(notesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isExpanded) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="fixed inset-4 z-50 bg-background rounded-lg border-2 border-border/50 shadow-2xl backdrop-blur-sm flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-border/50">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-accent" />
            Class Notes & Interactions
          </h2>
          <button
            onClick={onToggleExpand}
            className="p-2 rounded-full hover:bg-destructive/20 transition-colors"
            title="Close notes panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <AnimatePresence>
            {notes.length > 0 ? (
              notes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${typeColors[note.type]}`}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">{typeIcons[note.type]}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1 capitalize">{note.type}</p>
                      <p className="text-sm leading-relaxed">{note.content}</p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-foreground/50">
                        {note.studentName && <span>👤 {note.studentName}</span>}
                        <span>🕐 {note.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="flex items-center justify-center h-32 text-foreground/50">
                <p>No notes yet. Notes will appear as the lesson progresses...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex gap-2 p-6 border-t border-border/50">
          <button
            onClick={copyAllNotes}
            className="flex-1 gap-2 px-4 py-2 rounded-lg border border-border/50 hover:bg-accent/10 transition-colors text-sm font-medium flex items-center justify-center"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy All'}
          </button>
          <button
            onClick={exportNotes}
            className="flex-1 gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity text-sm font-medium text-white flex items-center justify-center"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Live Notes ({notes.length})
        </h3>
        <button
          onClick={onToggleExpand}
          className="p-2 rounded hover:bg-accent/10 transition-colors gap-2 flex items-center text-sm font-medium"
        >
          <Maximize2 className="w-4 h-4" />
          Expand
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        <AnimatePresence>
          {notes.length > 0 ? (
            notes.slice(0, 5).map((note, index) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className={`p-3 rounded border ${typeColors[note.type]} text-sm`}
              >
                <div className="flex gap-2">
                  <span className="text-lg flex-shrink-0">{typeIcons[note.type]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-xs capitalize opacity-75">{note.type}</p>
                    <p className="truncate text-xs mt-1">{note.content}</p>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-xs text-foreground/50 text-center py-4">
              Notes will appear during the lesson
            </div>
          )}
        </AnimatePresence>
      </div>

      {notes.length > 5 && (
        <p className="text-xs text-foreground/50 text-center">
          +{notes.length - 5} more notes ({notes.length} total)
        </p>
      )}

      <div className="flex gap-2">
        <button
          onClick={copyAllNotes}
          disabled={notes.length === 0}
          className="flex-1 gap-2 px-3 py-2 rounded border border-border/50 hover:bg-accent/10 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Copy className="w-4 h-4" />
          Copy
        </button>
        <button
          onClick={exportNotes}
          disabled={notes.length === 0}
          className="flex-1 gap-2 px-3 py-2 rounded bg-gradient-to-r from-accent to-primary hover:opacity-90 transition-opacity text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </motion.div>
  );
}
