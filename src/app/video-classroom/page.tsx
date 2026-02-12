'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Settings, RotateCw, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AIAvatarVideo } from '@/components/video-classroom/AIAvatarVideo';
import { VideoPlayerInteractive } from '@/components/video-classroom/VideoPlayerInteractive';
import { LanguageSwitcher } from '@/components/video-classroom/LanguageSwitcher';
import { EngagementMonitor } from '@/components/video-classroom/EngagementMonitor';
import { LiveNotesPanel } from '@/components/video-classroom/LiveNotesPanel';
import { StudentCameraGrid, type StudentCameraFeed } from '@/components/video-classroom/StudentCameraGrid';
import { DoubtResolutionPanel, type StudentDoubt, type DoubtResolution } from '@/components/video-classroom/DoubtResolutionPanel';
import { VideoGenerationService } from '@/lib/videoGenerationService';
import type { LessonSegment, ClassNote } from '@/lib/videoGenerationService';

interface AvatarState {
  expression: 'neutral' | 'happy' | 'thinking' | 'excited' | 'concerned';
  isSpeaking: boolean;
  isListening: boolean;
  gesture: string;
  engagementLevel: number;
}

export default function VideoClassroomPage() {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lessonGenerated, setLessonGenerated] = useState(false);
  const [topic, setTopic] = useState('');
  const [grade, setGrade] = useState('5');

  // Video and segments
  const [segments, setSegments] = useState<LessonSegment[]>([]);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

  // Avatar state
  const [avatarState, setAvatarState] = useState<AvatarState>({
    expression: 'neutral',
    isSpeaking: false,
    isListening: false,
    gesture: '',
    engagementLevel: 85,
  });

  // Engagement and notes
  const [engagementData, setEngagementData] = useState({
    overall: 85,
    attention: 88,
    participation: 82,
    retention: 85,
    activeStudents: 4,
    totalStudents: 8,
  });

  const [engagementHistory, setEngagementHistory] = useState<number[]>([85, 87, 84, 86, 88, 85, 87, 86, 85, 84]);

  const [notes, setNotes] = useState<ClassNote[]>([]);
  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [homework, setHomework] = useState<string[]>([]);

  // Students and hand raise
  const [students, setStudents] = useState<StudentCameraFeed[]>([
    {
      id: '1',
      studentId: '1',
      name: 'Rajesh',
      isHandRaised: false,
      confidence: 0.88,
      isActive: true,
      isMuted: false,
    },
    {
      id: '2',
      studentId: '2',
      name: 'Priya',
      isHandRaised: false,
      confidence: 0.92,
      isActive: true,
      isMuted: false,
    },
    {
      id: '3',
      studentId: '3',
      name: 'Arjun',
      isHandRaised: false,
      confidence: 0.75,
      isActive: true,
      isMuted: false,
    },
    {
      id: '4',
      studentId: '4',
      name: 'Isha',
      isHandRaised: false,
      confidence: 0.85,
      isActive: true,
      isMuted: false,
    },
  ]);

  // Doubt resolution
  const [selectedDoubt, setSelectedDoubt] = useState<StudentDoubt | null>(null);
  const [doubtResolution, setDoubtResolution] = useState<DoubtResolution | undefined>();
  const [isLoadingResolution, setIsLoadingResolution] = useState(false);
  const [isDoubtPanelOpen, setIsDoubtPanelOpen] = useState(false);

  // Generate lesson
  const handleGenerateLesson = useCallback(async () => {
    if (!topic) {
      alert('Please enter a topic');
      return;
    }

    setIsGenerating(true);
    try {
      const service = new VideoGenerationService();

      // Generate lesson script
      const lessonScript = await service.generateLessonScript(
        topic,
        grade,
        currentLanguage,
        'interactive'
      );

      // Get segments from lesson script
      const generatedSegments = lessonScript.segments;

      setSegments(generatedSegments);
      setKeyPoints(lessonScript.keyPoints);
      setHomework(await service.generateHomework(lessonScript));
      setLessonGenerated(true);
      setCurrentSegmentIndex(0);

      // Add initial notes
      const initialNote: ClassNote = {
        id: `note-${Date.now()}`,
        title: 'Lesson Started',
        content: `Starting lesson on "${topic}" for Grade ${grade}`,
        type: 'keypoint',
        timestamp: new Date(),
      };
      setNotes([initialNote]);

      // Simulate avatar speaking
      setAvatarState((prev): AvatarState => ({
        ...prev,
        expression: 'happy' as const,
        isSpeaking: true,
      }));
      setTimeout(
        () =>
          setAvatarState((prev) => ({
            ...prev,
            isSpeaking: false,
          })),
        2000
      );
    } catch (error) {
      console.error('Error generating lesson:', error);
      alert('Failed to generate lesson. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  }, [topic, grade, currentLanguage]);

  // Handle segment change
  const handleSegmentChange = useCallback((segmentId: string) => {
    const index = segments.findIndex((s) => s.id === segmentId);
    if (index !== -1) {
      setCurrentSegmentIndex(index);

      // Update avatar expression based on segment type
      const segment = segments[index];
      setAvatarState((prev): AvatarState => ({
        ...prev,
        expression: segment.avatarExpression,
        gesture: segment.gestures[0] || '',
      }));

      // Add note for interesting segments
      if (segment.type === 'question' || segment.type === 'example') {
        const newNote: ClassNote = {
          id: `note-${Date.now()}`,
          title: segment.title,
          content: segment.content.substring(0, 100),
          type: segment.type === 'question' ? 'question' : 'example',
          timestamp: new Date(),
        };
        setNotes((prev) => [...prev, newNote]);
      }
    }
  }, [segments]);

  // Handle language change
  const handleLanguageChange = useCallback(async (langCode: string) => {
    setCurrentLanguage(langCode);
    // In production, would regenerate content in new language
    // For now, just simulate a brief translation delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }, []);

  // Handle engagement update
  const handleEngagementUpdate = useCallback((level: number) => {
    setEngagementData((prev) => ({
      ...prev,
      overall: level,
      attention: Math.max(level - 3, 0),
      participation: Math.max(level - 5, 0),
    }));

    setEngagementHistory((prev) => {
      const updated = [...prev.slice(1), level];
      if (updated.length > 10) return updated.slice(-10);
      return updated;
    });
  }, []);

  // Simulate hand raise detection
  useEffect(() => {
    if (!lessonGenerated) return;

    const handRaiseInterval = setInterval(() => {
      const randomStudent = Math.floor(Math.random() * students.length);
      if (Math.random() < 0.15) {
        // 15% chance of hand raise
        setStudents((prev) =>
          prev.map((s, i) =>
            i === randomStudent ? { ...s, isHandRaised: true } : s
          )
        );

        // Create doubt
        const raisedStudent = students[randomStudent];
        const doubts = [
          'Can you explain this again?',
          'How do we apply this in real life?',
          'I did not understand the example',
          'Can you give another example?',
          'Is there a simpler way to solve this?',
        ];

        const doubt: StudentDoubt = {
          id: `doubt-${Date.now()}`,
          studentName: raisedStudent.name,
          studentId: raisedStudent.studentId,
          question: doubts[Math.floor(Math.random() * doubts.length)],
          difficulty: (['easy', 'medium', 'hard'] as const)[Math.floor(Math.random() * 3)],
          timestamp: new Date(),
        };

        setSelectedDoubt(doubt);

        // Simulate loading resolution
        setIsLoadingResolution(true);
        setTimeout(() => {
          const resolution: DoubtResolution = {
            explanation: 'This is simpler than it looks. Think about it like this...',
            ruralExample:
              'Imagine you have 5 acres of land and want to divide it equally among 3 brothers...',
            keyPoint: 'Always remember: break complex problems into smaller steps',
            followUpQuestion: 'Can you try solving a similar problem now?',
            correctionTip: 'Good question! Many students wonder about this too.',
          };
          setDoubtResolution(resolution);
          setIsLoadingResolution(false);
          setIsDoubtPanelOpen(true);
        }, 800);
      }
    }, 8000);

    return () => clearInterval(handRaiseInterval);
  }, [students, lessonGenerated]);

  // Clear hand raise when doubt resolved
  const handleDoubtResolved = useCallback(() => {
    setStudents((prev) =>
      prev.map((s) =>
        s.studentId === selectedDoubt?.studentId ? { ...s, isHandRaised: false } : s
      )
    );
    setIsDoubtPanelOpen(false);
    setSelectedDoubt(null);
  }, [selectedDoubt]);

  const currentSegment = segments[currentSegmentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Setup Screen */}
      {!lessonGenerated && (
        <motion.div
          className="min-h-screen flex items-center justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl border border-border/50 bg-gradient-to-br from-background to-secondary/20 p-8 shadow-xl"
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                SAHAYAK
              </h1>
              <p className="text-muted-foreground">Interactive Video Teaching System</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Topic</label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Fractions, Photosynthesis, Algebra"
                  className="w-full px-4 py-2 rounded-lg border border-border/50 bg-secondary/30 focus:border-primary focus:outline-none transition"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Grade Level</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border/50 bg-secondary/30 focus:border-primary focus:outline-none transition"
                >
                  <option value="3">Grade 3</option>
                  <option value="4">Grade 4</option>
                  <option value="5">Grade 5</option>
                  <option value="6">Grade 6</option>
                  <option value="7">Grade 7</option>
                  <option value="8">Grade 8</option>
                </select>
              </div>

              <Button
                onClick={handleGenerateLesson}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg h-12 text-base font-semibold"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Generate Interactive Video
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Main Teaching Interface */}
      {lessonGenerated && (
        <motion.div
          className="min-h-screen p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">Interactive Teaching - {topic}</h1>
                <p className="text-muted-foreground text-sm">Grade {grade} • {currentLanguage.toUpperCase()}</p>
              </div>
              <Button
                variant="outline"
                onClick={() => setLessonGenerated(false)}
                className="gap-2"
              >
                <RotateCw className="w-4 h-4" />
                New Lesson
              </Button>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              {/* Left Column - Video Player */}
              <div className="lg:col-span-2 space-y-4">
                {/* Language Switcher */}
                <LanguageSwitcher
                  currentLanguage={currentLanguage}
                  onLanguageChange={handleLanguageChange}
                />

                {/* Video Player */}
                {segments.length > 0 && (
                  <VideoPlayerInteractive
                    segments={segments}
                    topic={topic}
                    onSegmentChange={handleSegmentChange}
                    onEngagementUpdate={handleEngagementUpdate}
                  />
                )}

                {/* Avatar for detailed view */}
                {!currentSegment && (
                  <motion.div
                    className="rounded-xl border border-border/50 bg-gradient-to-br from-primary/10 to-accent/10 p-8 h-64 flex flex-col items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-muted-foreground text-center">Select a segment to begin</p>
                  </motion.div>
                )}

                {currentSegment && (
                  <motion.div
                    className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-secondary/10 p-8 h-64 flex flex-col items-center justify-center"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <AIAvatarVideo
                      message={currentSegment.content}
                      state={avatarState}
                    />
                  </motion.div>
                )}
              </div>

              {/* Right Column - Monitoring */}
              <div className="lg:col-span-2 space-y-4">
                {/* Engagement */}
                <EngagementMonitor
                  data={engagementData}
                  history={engagementHistory}
                  onLowEngagement={() => console.log('Low engagement alert')}
                />

                {/* Student Cameras */}
                <StudentCameraGrid
                  students={students}
                  gridSize="medium"
                  onHandRaiseDetected={(studentId) => {
                    console.log('Hand raised by:', studentId);
                  }}
                />

                {/* Notes Panel */}
                <LiveNotesPanel
                  notes={notes}
                  topic={topic}
                  keyPoints={keyPoints}
                  homework={homework}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Doubt Resolution Modal */}
      <DoubtResolutionPanel
        doubt={selectedDoubt}
        isOpen={isDoubtPanelOpen}
        resolution={doubtResolution}
        isLoadingResolution={isLoadingResolution}
        onClose={() => {
          handleDoubtResolved();
        }}
        onResolve={(doubtId, resolution) => {
          console.log('Doubt resolved:', doubtId, resolution);
          handleDoubtResolved();
        }}
      />
    </div>
  );
}
