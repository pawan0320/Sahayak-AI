'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Loader } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function LessonPlanner() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    inputType: 'text',
    topic: '',
    grade: '',
    language: '',
    feedback: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log('Lesson generated:', formData);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <div className="flex-1 flex flex-col">
        <Header title="AI Lesson Planner" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Input Type Selection */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border-border/50">
                <h2 className="text-2xl font-bold mb-6">Create AI-Generated Lesson</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Input Type Tabs */}
                  <div className="flex gap-2 bg-secondary/30 p-1 rounded-lg w-fit">
                    {[
                      { value: 'text', label: 'Text' },
                      { value: 'image', label: 'Image' },
                      { value: 'voice', label: 'Voice' },
                      { value: 'pdf', label: 'PDF Book' },
                    ].map((type) => (
                      <button
                        key={type.value}
                        onClick={() => setFormData({ ...formData, inputType: type.value })}
                        className={`px-4 py-2 rounded font-medium transition ${
                          formData.inputType === type.value
                            ? 'bg-primary text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>

                  {/* Input Field */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Lesson Topic / Content</label>
                    {formData.inputType === 'text' && (
                      <textarea
                        value={formData.topic}
                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                        placeholder="Describe your lesson topic or paste content here..."
                        className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-24 resize-none"
                      />
                    )}
                    {formData.inputType !== 'text' && (
                      <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-muted-foreground">
                          Click to upload or drag {formData.inputType} file
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Grade & Language */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Grade Level</label>
                      <select
                        value={formData.grade}
                        onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Select grade</option>
                        <option value="6">Grade 6</option>
                        <option value="9">Grade 9</option>
                        <option value="10">Grade 10</option>
                        <option value="12">Grade 12</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Language</label>
                      <select
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                        className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="">Select language</option>
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="mr">Marathi</option>
                      </select>
                    </div>
                  </div>

                  {/* Feedback */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Teacher Feedback (Optional)</label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
                      placeholder="Any specific requirements or preferences..."
                      className="w-full p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-20 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 py-3"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        Generating Lesson...
                      </>
                    ) : (
                      'Generate Lesson'
                    )}
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* Output Display */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <Card className="p-8 border-border/50 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                    <Loader className="w-8 h-8 text-primary animate-spin" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Generating Your Lesson</h3>
                  <p className="text-muted-foreground">
                    AI is creating animated PPT, videos, quizzes, and notes...
                  </p>
                </Card>
              </motion.div>
            )}

            {/* Output Tabs */}
            {!isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: FileText, label: 'PPT', color: 'from-orange-500/20' },
                    { icon: FileText, label: 'Video', color: 'from-red-500/20' },
                    { icon: FileText, label: 'Quiz', color: 'from-blue-500/20' },
                    { icon: FileText, label: 'Notes', color: 'from-green-500/20' },
                  ].map((item, i) => (
                    <Card
                      key={i}
                      className={`p-6 border-border/50 hover:border-primary/50 transition cursor-pointer text-center bg-gradient-to-br ${item.color} to-transparent`}
                    >
                      <item.icon className="w-8 h-8 mx-auto mb-3 text-primary" />
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-1">Ready</p>
                    </Card>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
