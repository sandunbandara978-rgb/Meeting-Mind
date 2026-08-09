# MeetingMind - AI Meeting Recorder, Summarizer & Task Manager

MeetingMind is a modern AI-powered platform that records team meetings, converts speech into text in real-time or from audio file uploads, summarizes discussions, extracts key decisions, automatically generates actionable tasks into a Kanban board, and allows querying meeting transcripts via an interactive AI assistant.

---

## 🛠️ Technology Stack Architecture

### **Frontend (`client/`)**
- **Core**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom Dark Mode Design Tokens + Glassmorphism
- **State Management**: Zustand (`useMeetingStore`, `useAuthStore`)
- **Data Fetching**: TanStack React Query (`@tanstack/react-query`) + Axios
- **Icons**: Lucide React (`lucide-react`)
- **Speech Recognition**: Web Speech API (`webkitSpeechRecognition`) + OpenAI Whisper API

### **Backend (`server/`)**
- **Runtime**: Node.js + Express.js + TypeScript
- **Database & ORM**: PostgreSQL + Prisma ORM (`User`, `Meeting`, `TranscriptSegment`, `Decision`, `Task`)
- **AI Engine**: OpenAI API (Whisper `v1/audio/transcriptions` for speech recognition & `gpt-4o-mini` for summary & decision extraction)
- **Authentication**: JWT authentication with refresh token strategy & OAuth structure

### **DevOps & Infrastructure**
- **Containerization**: Docker & `docker-compose.yml`
- **CI/CD**: GitHub Actions (`.github/workflows/ci.yml`)

---

## 🚀 Quick Start Guide

### Option 1: Running with Docker Compose (Recommended)

1. Ensure Docker Desktop is installed and running.
2. Clone the repository and run:
   ```bash
   docker compose up --build
   ```
3. Open your browser:
   - **Frontend App**: `http://localhost:3000`
   - **Backend API**: `http://localhost:5000/health`

---

### Option 2: Running Locally

#### 1. Start Backend Server
```bash
cd server
npm install
npx prisma generate
npm run dev
```

#### 2. Start Frontend App
```bash
cd client
npm install
npm run dev
```

---

## ⚙️ Environment Variables (`server/.env`)

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/meetingmind?schema=public"
JWT_SECRET="meetingmind_secret_jwt_key_2026"
OPENAI_API_KEY="your-openai-api-key-here"
```

---

## 🎯 Key Features Included

1. **Live Studio Recording**: Real-time microphone capture, live waveform visualizer, continuous speech-to-text ticker, speaker selection tags, and instant moment bookmarking (*Decision*, *Action Item*, *Note*).
2. **Audio File Upload & Whisper Transcribe**: Drag-and-drop `.mp3`/`.wav` upload with automated AI transcription and key decision parsing.
3. **Meetings Library & Details**: Detailed meeting view with timestamped transcript search, speaker filter, copyable executive summary, and one-click Markdown exporter.
4. **Kanban Action Items Board**: Automatically synced task board supporting status columns (*To Do*, *In Progress*, *Review*, *Completed*), priority tags, assignee filtering, and task creation.
5. **AI Q&A Assistant**: Contextual chatbot to query past meeting archives for decisions, tasks, or specific discussions.
6. **Team Analytics Dashboard**: Visual charts for meeting volume, speaker talk-time distribution, decision count, and sentiment health scores.
