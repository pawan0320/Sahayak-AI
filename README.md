# Sahayak - AI Teacher Assistant

A modern AI-powered educational platform built with Next.js 14, TypeScript, and Tailwind CSS. Sahayak empowers teachers in rural India with cutting-edge AI tools to simplify lesson planning, automate reports, and personalize education.

## 🎯 Overview

Sahayak is a comprehensive educational technology platform designed to revolutionize teaching and learning. With built-in AI capabilities, it helps teachers automate routine tasks, engage students effectively, and gain actionable insights into student performance.

## ✨ Key Features

### For Teachers
- **AI Lesson Planner**: Automatically generate animated PPTs, videos, quizzes, and notes
- **Smart Group Divider**: Intelligently create balanced student groups
- **Performance Analytics**: Real-time visualization of student progress
- **Daily Reports**: Automated generation of comprehensive daily reports
- **AI Classroom Avatar**: Interactive AI avatar for lesson explanation
- **Teacher Dashboard**: KPI cards, performance charts, at-risk student identification

### For Students
- **Personal Dashboard**: Track progress, attendance, quiz scores
- **Interactive Lessons**: Engage with AI-powered classroom sessions
- **Face Recognition**: Biometric login and automatic attendance marking
- **Performance Tracking**: Visual charts showing subject-wise performance

### For Administrators
- **System Dashboard**: Monitor teachers, students, and analytics
- **School Management**: Register and manage multiple schools
- **User Approvals**: Review and approve pending accounts
- **Analytics**: System-wide activity tracking

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Validation**: Zod

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── auth/                    # Authentication pages
│   ├── dashboard/               # Teacher dashboard
│   ├── classroom/               # AI classroom
│   ├── lessons/                 # Lesson planner
│   ├── groups/                  # Group divider
│   ├── analytics/               # Analytics
│   ├── assistant/               # AI assistant
│   ├── schedule/                # Schedule & calendar
│   ├── profile/                 # User profile
│   ├── student/                 # Student pages
│   └── admin/                   # Admin pages
├── components/
│   ├── ui/                      # UI components
│   └── layout/                  # Layout components
├── lib/
│   ├── types.ts                 # TypeScript types
│   └── constants.ts             # App constants
└── styles/
    └── globals.css              # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm 9+

### Installation

```bash
# Navigate to project directory
cd /Users/pawansaikodali/Downloads/sahayak-ai

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📚 Pages & Routes

### Public
- `/` - Landing page
- `/auth/*` - Authentication pages

### Protected Routes
- `/dashboard` - Teacher dashboard
- `/lessons` - AI Lesson Planner
- `/groups` - Smart Group Divider
- `/analytics` - Performance Analytics
- `/assistant` - AI Teaching Assistant
- `/schedule` - Schedule Management
- `/profile` - User Profile
- `/classroom/setup` - Classroom Setup
- `/classroom` - Live Classroom

## 🎬 Features

✅ Landing page with animations
✅ Multi-role authentication system
✅ Teacher dashboard with KPIs and charts
✅ Student dashboard with progress tracking
✅ Admin dashboard with system analytics
✅ AI Lesson Planner
✅ Smart Group Divider
✅ Performance Analytics
✅ AI Teaching Assistant
✅ Classroom Avatar system
✅ Schedule management
✅ User profiles
✅ Responsive design
✅ Dark mode support
✅ Smooth animations

## 🛠️ Development

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

### Lint
```bash
npm run lint
```

## 📖 Documentation

- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Framer Motion](https://www.framer.com/motion)

---

**Sahayak - Empowering Teachers, Transforming Education** 🚀
