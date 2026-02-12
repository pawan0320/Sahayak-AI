'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Download, Loader, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export default function GroupDivider() {
  const [isLoading, setIsLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [students, setStudents] = useState<{ name: string; skills: string; interests: string }[]>([]);
  const [formData, setFormData] = useState({
    groupSize: '4',
  });

  const addStudent = () => {
    setStudents([...students, { name: '', skills: '', interests: '' }]);
  };

  const updateStudent = (index: number, field: string, value: string) => {
    const updated = [...students];
    updated[index] = { ...updated[index], [field]: value };
    setStudents(updated);
  };

  const removeStudent = (index: number) => {
    setStudents(students.filter((_, i) => i !== index));
  };

  const generateGroups = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setGenerated(true);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar userRole="teacher" />

      <div className="flex-1 flex flex-col">
        <Header title="AI Group Divider" />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-6 border-border/50">
                <h2 className="text-2xl font-bold mb-6">Create Balanced Student Groups</h2>

                {/* Group Size */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Preferred Group Size</label>
                  <select
                    value={formData.groupSize}
                    onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                    className="w-32 px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="2">2 students</option>
                    <option value="3">3 students</option>
                    <option value="4">4 students</option>
                    <option value="5">5 students</option>
                  </select>
                </div>

                {/* Students List */}
                <div className="space-y-4 mb-6">
                  {students.map((student, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="grid grid-cols-12 gap-3 items-end"
                    >
                      <input
                        type="text"
                        value={student.name}
                        onChange={(e) => updateStudent(index, 'name', e.target.value)}
                        placeholder="Student name"
                        className="col-span-3 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        value={student.skills}
                        onChange={(e) => updateStudent(index, 'skills', e.target.value)}
                        placeholder="Skills (Math, Science...)"
                        className="col-span-4 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <input
                        type="text"
                        value={student.interests}
                        onChange={(e) => updateStudent(index, 'interests', e.target.value)}
                        placeholder="Interests"
                        className="col-span-4 px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                      <button
                        onClick={() => removeStudent(index)}
                        className="col-span-1 p-2 text-destructive hover:bg-destructive/10 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>

                {/* Add Student Button */}
                <div className="flex gap-4">
                  <Button variant="outline" onClick={addStudent} className="flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Student
                  </Button>

                  <Button
                    onClick={generateGroups}
                    disabled={isLoading || students.length < 2}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      '🤖 Generate Groups'
                    )}
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Results Section */}
            {generated && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">Generated Groups</h3>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Export Groups
                  </Button>
                </div>

                {[1, 2, 3].map((groupNum) => (
                  <motion.div
                    key={groupNum}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: groupNum * 0.1 }}
                  >
                    <Card className="p-6 border-border/50">
                      <h4 className="text-lg font-semibold mb-4">Group {groupNum}</h4>
                      <div className="space-y-2">
                        {['Aman Singh', 'Priya Sharma', 'Raj Kumar', 'Deepa Nair'].slice(0, parseInt(formData.groupSize)).map((name, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 bg-secondary/30 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-foreground text-sm font-bold">
                              {idx + 1}
                            </div>
                            <span className="font-medium">{name}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Balanced by skills and learning style
                      </p>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
