'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Zap, Video, Users, Loader, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function ClassroomSetup() {
  const [formData, setFormData] = useState({
    topic: '',
    grade: '',
    language: '',
    feedback: '',
  });
  const [isLoading, setIsLoading] = useState<'explanation' | 'avatar' | 'classroom' | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const grades = ['6', '7', '8', '9', '10', '11', '12'];
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' },
    { code: 'gu', name: 'Gujarati' },
    { code: 'ta', name: 'Tamil' },
    { code: 'te', name: 'Telugu' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAction = async (action: 'explanation' | 'avatar' | 'classroom') => {
    if (!formData.topic || !formData.grade || !formData.language) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(action);
    setTimeout(() => {
      setIsLoading(null);
      setCompletedActions((prev) => new Set(prev).add(action));

      if (action === 'classroom') {
        // Redirect to classroom page
        window.location.href = '/classroom';
      }
    }, 2000);
  };

  const isFormValid = formData.topic && formData.grade && formData.language;

  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col lg:flex-row">
        <Sidebar />

        <main className="flex-1">
          <Header title="Setup Lesson" showMenu={true} />

          <div className="p-4 sm:p-6 lg:p-8 max-w-5xl">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                Prepare Your Lesson
              </h1>
              <p className="text-muted-foreground">
                Enter your lesson details below and let AI help you prepare an engaging classroom experience
              </p>
            </motion.div>

            {/* Main Form Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Input Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-1"
              >
                <Card className="p-6 border-border/50 bg-gradient-to-br from-background to-secondary/10 sticky top-20">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    Lesson Details
                  </h2>

                  <div className="space-y-5">
                    {/* Topic Input */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Lesson Topic <span className="text-destructive">*</span>
                      </label>
                      <textarea
                        value={formData.topic}
                        onChange={(e) => handleInputChange('topic', e.target.value)}
                        placeholder="E.g., Introduction to Photosynthesis, Quadratic Equations, French Revolution"
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-24 resize-none"
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">Describe your lesson topic clearly</p>
                    </div>

                    {/* Grade Level */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Grade Level <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.grade}
                        onChange={(e) => handleInputChange('grade', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        <option value="">Select grade</option>
                        {grades.map((grade) => (
                          <option key={grade} value={grade}>
                            Grade {grade}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Medium of Instruction <span className="text-destructive">*</span>
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                        required
                      >
                        <option value="">Select language</option>
                        {languages.map((lang) => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Teacher Feedback */}
                    <div>
                      <label className="block text-sm font-medium mb-2">Teacher Feedback</label>
                      <textarea
                        value={formData.feedback}
                        onChange={(e) => handleInputChange('feedback', e.target.value)}
                        placeholder="Optional: Any specific instructions, key points, or teaching approach preferences..."
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-20 resize-none"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Optional - helps AI personalize your lesson</p>
                    </div>

                    {/* Form Status */}
                    <div className={`p-3 rounded-lg border ${
                      isFormValid
                        ? 'bg-success/10 border-success/30 text-success'
                        : 'bg-warning/10 border-warning/30 text-warning'
                    }`}>
                      <p className="text-sm font-medium">
                        {isFormValid ? '✓ Ready to generate content' : '⚠ Complete all required fields'}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Right Column - AI Actions */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-6"
              >
                {/* AI Actions Overview */}
                <Card className="p-6 border-border/50 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 border-primary/30">
                  <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-primary" />
                    AI-Powered Actions
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Generate engaging content, start an interactive AI avatar, and manage your classroom seamlessly
                  </p>
                </Card>

                {/* Action 1: Generate Explanation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <Card className="p-6 border-border/50 hover:border-primary/50 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition">
                          <BookOpen className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Generate Explanation</h3>
                          <p className="text-sm text-muted-foreground">
                            AI creates a detailed, engaging explanation of your lesson topic tailored to the grade level
                          </p>
                        </div>
                      </div>
                      {completedActions.has('explanation') && (
                        <Check className="w-5 h-5 text-success mt-1" />
                      )}
                    </div>

                    <div className="space-y-3 mb-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="text-sm">
                        <p className="font-medium mb-1">Will Include:</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>✓ Core concepts & definitions</li>
                          <li>✓ Real-world examples</li>
                          <li>✓ Interactive discussion points</li>
                          <li>✓ Age-appropriate language</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAction('explanation')}
                      disabled={!isFormValid || isLoading === 'explanation'}
                      className="w-full gap-2 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading === 'explanation' ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          Generate Explanation
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>

                {/* Action 2: Start AI Avatar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <Card className="p-6 border-border/50 hover:border-accent/50 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-accent/10 group-hover:bg-accent/20 transition">
                          <Video className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Start AI Avatar</h3>
                          <p className="text-sm text-muted-foreground">
                            Launch an interactive AI avatar that presents your lesson with natural speech and animations
                          </p>
                        </div>
                      </div>
                      {completedActions.has('avatar') && (
                        <Check className="w-5 h-5 text-success mt-1" />
                      )}
                    </div>

                    <div className="space-y-3 mb-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="text-sm">
                        <p className="font-medium mb-1">Avatar Features:</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>✓ Natural speech synthesis in selected language</li>
                          <li>✓ Engaging animations & expressions</li>
                          <li>✓ Interactive Q&A capabilities</li>
                          <li>✓ Hand detection for student participation</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAction('avatar')}
                      disabled={!isFormValid || isLoading === 'avatar'}
                      className="w-full gap-2 bg-gradient-to-r from-accent to-primary hover:opacity-90 disabled:opacity-50"
                    >
                      {isLoading === 'avatar' ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Initializing...
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4" />
                          Start AI Avatar
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>

                {/* Action 3: Begin Classroom Mode */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Card className="p-6 border-border/50 hover:border-success/50 transition-all group border-2">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-3 rounded-lg bg-success/10 group-hover:bg-success/20 transition">
                          <Users className="w-6 h-6 text-success" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">Begin Classroom Mode</h3>
                          <p className="text-sm text-muted-foreground">
                            Start a full interactive classroom session with AI avatar, student engagement tracking, and live notes
                          </p>
                        </div>
                      </div>
                      {completedActions.has('classroom') && (
                        <Check className="w-5 h-5 text-success mt-1" />
                      )}
                    </div>

                    <div className="space-y-3 mb-4 p-4 bg-secondary/20 rounded-lg">
                      <div className="text-sm">
                        <p className="font-medium mb-1">Classroom Includes:</p>
                        <ul className="text-muted-foreground space-y-1">
                          <li>✓ AI avatar teaching assistant</li>
                          <li>✓ Real-time student participation detection</li>
                          <li>✓ Automated attendance tracking</li>
                          <li>✓ Live class notes generation</li>
                          <li>✓ Q&A management system</li>
                          <li>✓ Session recording & analytics</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleAction('classroom')}
                      disabled={!isFormValid || isLoading === 'classroom'}
                      className="w-full gap-2 bg-gradient-to-r from-success to-accent hover:opacity-90 disabled:opacity-50 py-3 h-auto text-base font-semibold"
                    >
                      {isLoading === 'classroom' ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Starting Session...
                        </>
                      ) : (
                        <>
                          <Users className="w-4 h-4" />
                          Begin Classroom Mode 🚀
                        </>
                      )}
                    </Button>
                  </Card>
                </motion.div>
              </motion.div>
            </div>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 p-4 rounded-lg bg-secondary/20 border border-border/50"
            >
              <p className="text-sm text-muted-foreground">
                <strong>💡 Pro Tip:</strong> Use the optional Teacher Feedback to guide AI on teaching style, key focus areas, or specific examples you want included. This helps personalize the lesson to your classroom's needs.
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
