'use client';

import { motion } from 'framer-motion';
import { Bot, BrainCircuit, Users, BarChart3, MessageSquare, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Home() {

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Bot className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Sahayak
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium hover:text-primary transition">Features</a>
              <a href="#benefits" className="text-sm font-medium hover:text-primary transition">How It Works</a>
              <a href="#" className="text-sm font-medium hover:text-primary transition">Pricing</a>
            </nav>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <a href="/auth">Login</a>
              </Button>
              <Button size="sm" asChild>
                <a href="/auth">Sign Up</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-20">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Agentic AI Empowering Teachers
            </h1>
            
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Sahayak empowers teachers in rural India with cutting-edge AI tools to simplify lesson planning, automate reports, and personalize education for every student.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
                  <a href="/auth">Sign Up for Free</a>
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="outline" asChild>
                  <a href="#features">Learn More <ArrowRight className="w-4 h-4 ml-2" /></a>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Powerful Features</h2>
            <p className="text-lg text-muted-foreground">Everything you need to transform your teaching</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: BrainCircuit,
                title: 'AI-Powered Lesson Prep',
                description: 'Auto-generate animated PPTs, videos, and localized quizzes from text, image, or voice inputs.',
              },
              {
                icon: Users,
                title: 'Smart Group Divider',
                description: 'Intelligently create balanced student groups for collaborative learning.',
              },
              {
                icon: BarChart3,
                title: 'Performance Analytics',
                description: 'Visualize student progress and identify at-risk students in real-time.',
              },
              {
                icon: MessageSquare,
                title: 'Daily Student Reports',
                description: 'Automatically generate comprehensive daily reports for each student.',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="p-6 h-full border-border/50 hover:border-primary/50 transition-all bg-background hover:bg-card hover:shadow-lg hover:shadow-primary/10 group cursor-pointer">
                  <div className="bg-gradient-to-br from-primary/20 to-accent/20 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-accent/30 transition">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Benefits of using Sahayak</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Save Precious Time',
                description: 'Automate routine tasks and focus on what matters - teaching and connecting with students.',
              },
              {
                title: 'Engage Every Student',
                description: 'Personalized AI interactions ensure each student gets the attention they need.',
              },
              {
                title: 'Gain Actionable Insights',
                description: 'Real-time analytics help you make data-driven decisions about your teaching.',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 text-center border-border/50 hover:border-accent/50 transition-all bg-background">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full mb-4">
                    <CheckCircle2 className="w-7 h-7 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">Ready to Transform Education?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of teachers already using Sahayak to revolutionize their classrooms.
            </p>
            <Button size="lg" asChild className="bg-gradient-to-r from-primary to-accent hover:opacity-90">
              <a href="/auth">Start Your Journey Today</a>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 sm:px-6 lg:px-8 bg-secondary/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Sahayak. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
