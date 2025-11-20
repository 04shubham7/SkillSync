# SkillSync - Real-time Collaborative Technical Interview Platform

<div align="center">

![SkillSync Banner](https://img.shields.io/badge/SkillSync-Technical%20Interviews-blue?style=for-the-badge)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.23-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-4.15.0-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Stream](https://img.shields.io/badge/Stream-Video%20SDK-005FFF?style=flat-square)](https://getstream.io/)

**A modern, full-stack platform for conducting collaborative technical interviews with real-time code editing, video calls, and smart scheduling.**

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture) • [Demo](#-demo)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Environment Setup](#-environment-variables)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**SkillSync** is a comprehensive technical interview platform designed to streamline the hiring process for software development roles. It combines real-time video communication, collaborative code editing, and intelligent scheduling to create a seamless interview experience for both interviewers and candidates.

### Problem Statement
Traditional technical interviews face challenges:
- Lack of real-time collaboration tools
- Poor code sharing mechanisms
- Scheduling conflicts and coordination issues
- No centralized platform for interview management
- Limited recording and review capabilities

### Solution
SkillSync addresses these challenges by providing:
- **Real-time Video Calls**: HD video/audio using Stream Video SDK
- **Collaborative Code Editor**: Live code editing with Monaco Editor and Yjs CRDT
- **Smart Scheduling**: Calendar-based interview scheduling with conflict detection
- **Question Bank Management**: Customizable coding challenges (LeetCode-style problems)
- **Recording & Playback**: Automatic interview recording and storage
- **Role-Based Access**: Separate interfaces for interviewers and candidates
- **Multi-Language Support**: JavaScript, Python, Java, and C++ code execution

---

## ✨ Features

### 🎥 **Video Conferencing**
- High-quality video/audio calls powered by Stream Video SDK
- Screen sharing capabilities
- Real-time participant management
- Low-latency WebRTC connections
- Recording and playback functionality

### 💻 **Collaborative Code Editor**
- **Monaco Editor** integration (VS Code's editor)
- **Real-time synchronization** using Yjs CRDT
- **Multi-language support**: JavaScript, Python, Java, C++
- **Syntax highlighting** and intelligent code completion
- **Problem selector dropdown** with predefined coding challenges
- **Language switcher** with starter code templates
- **Live cursor tracking** (see what your partner is typing)

### 📅 **Smart Scheduling**
- Interactive calendar interface
- Time slot selection with availability checking
- Automated email notifications (planned)
- Interview status management (Upcoming, Completed, Succeeded, Failed)
- Candidate information tracking

### 🎯 **Interview Management Dashboard**
- **For Interviewers**:
  - View all scheduled interviews
  - Access interview recordings
  - Manage candidate evaluations (Pass/Fail)
  - Add/Edit/Delete coding questions
  - View candidate details and comments
  
- **For Candidates**:
  - View upcoming interviews
  - Join meetings via invitation link
  - Access past interview recordings

### 🔐 **Authentication & Authorization**
- Google OAuth integration via NextAuth.js
- Role-based access control (Interviewer/Candidate)
- Secure session management
- JWT-based API authentication

### 💬 **Real-time Chat**
- In-meeting text chat using Stream Chat SDK
- Message history persistence
- File sharing capabilities (planned)

### 📊 **Analytics & Reporting**
- Interview statistics
- Candidate performance tracking
- Question difficulty metrics
- Success rate analytics

---

## 🛠 Tech Stack

### **Frontend**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Next.js 14.2.23** | React Framework | Server-side rendering, API routes, optimized performance, App Router |
| **TypeScript** | Type Safety | Catch errors early, better IDE support, improved maintainability |
| **Tailwind CSS** | Styling | Utility-first CSS, rapid development, consistent design system |
| **Framer Motion** | Animations | Smooth, performant animations for enhanced UX |
| **shadcn/ui** | Component Library | Accessible, customizable React components |
| **Lucide React** | Icons | Modern, tree-shakeable icon library |

### **Backend**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Next.js API Routes** | Backend API | Serverless functions, same codebase as frontend, type-safe |
| **Prisma ORM** | Database ORM | Type-safe database queries, automatic migrations, excellent DX |
| **PostgreSQL** | Database | Relational data, ACID compliance, robust querying capabilities |
| **NextAuth.js** | Authentication | OAuth providers, session management, secure and flexible |
| **Express.js** | WebSocket Server | Collaborative editing server for Yjs synchronization |

### **Real-time Communication**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Stream Video SDK** | Video Calls | Enterprise-grade, low-latency, built-in recording |
| **Stream Chat SDK** | In-app Messaging | Real-time chat, message persistence, typing indicators |
| **Socket.io** | WebSocket | Bidirectional event-based communication |
| **Yjs** | CRDT Library | Conflict-free replicated data for collaborative editing |
| **y-websocket** | Yjs Transport | WebSocket provider for Yjs document synchronization |

### **Code Editor**
| Technology | Purpose | Why Chosen |
|------------|---------|------------|
| **Monaco Editor** | Code Editor | VS Code's editor, syntax highlighting, IntelliSense |
| **y-monaco** | Monaco + Yjs Binding | Connect Monaco Editor with Yjs for real-time collaboration |

### **DevOps & Deployment**
| Technology | Purpose |
|------------|---------|
| **Vercel** | Frontend Hosting (recommended) |
| **Railway/Heroku** | Collaborative server hosting |
| **PostgreSQL Cloud** | Database hosting (Supabase/Neon) |

---

## 🏗 Architecture

### **System Architecture Diagram**

```mermaid
graph TD
    Client[Client Browser]
    
    subgraph Frontend
        NextJS[Next.js App]
        Monaco[Monaco Editor]
        StreamSDK[Stream SDK]
    end
    
    subgraph Backend
        NextAPI[Next.js API Routes]
        Auth[NextAuth.js]
        CollabServer[Express Collab Server]
    end
    
    subgraph Database
        Postgres[(PostgreSQL)]
        Prisma[Prisma ORM]
    end
    
    subgraph ExternalServices
        Google[Google OAuth]
        StreamAPI[Stream API Cloud]
    end
    
    Client --> NextJS
    NextJS --> NextAPI
    NextJS --> StreamSDK
    NextJS --> Monaco
    
    Monaco -- WebSocket --> CollabServer
    StreamSDK -- WebRTC --> StreamAPI
    
    NextAPI --> Prisma
    Prisma --> Postgres
    
    Auth --> Google
    NextAPI --> Auth
```

### **Data Flow**

#### **1. User Authentication Flow**
```
User → Google OAuth → NextAuth → Database → Session Creation → Dashboard
```

#### **2. Interview Scheduling Flow**
```
Interviewer → Select Date/Time → Create Interview → 
Save to Database → Generate Meeting Link → Send to Candidate
```

#### **3. Real-time Collaboration Flow**
```
User Types in Editor → Yjs CRDT → WebSocket → Express Server →
Sync to All Clients → Update Monaco Editor
```

#### **4. Video Call Flow**
```
User Joins Meeting → Stream SDK → WebRTC Connection →
Establish P2P/TURN → Video/Audio Streaming → Recording
```

---

## 🚀 Getting Started

### **Prerequisites**

- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** or **yarn** or **pnpm**
- **Git**

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/04shubham7/SkillSync.git
cd SkillSync
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL database**
```bash
# Create a new PostgreSQL database
createdb skillsync_db

# Or using psql
psql -U postgres
CREATE DATABASE skillsync_db;
```

4. **Configure environment variables**
```bash
cp .env.example .env.local
```
Edit `.env.local` with your credentials (see [Environment Variables](#-environment-variables) section)

5. **Run database migrations**
```bash
npx prisma migrate dev
npx prisma generate
```

6. **Seed the database** (Optional)
```bash
npm run seed:more
```

7. **Start the development servers**

**Terminal 1 - Next.js App:**
```bash
npm run dev
```

**Terminal 2 - Collaborative Server:**
```bash
npm run collaborative-server:dev
```

8. **Open your browser**
```
http://localhost:3000
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/skillsync_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here" # Generate: openssl rand -base64 32

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Stream Video & Chat
NEXT_PUBLIC_STREAM_API_KEY="your-stream-api-key"
STREAM_API_SECRET="your-stream-secret-key"

# Collaborative Server
COLLABORATIVE_SERVER_URL="http://localhost:3002"

# Optional: For production
NODE_ENV="development"
```

### **Getting API Keys**

#### **Google OAuth**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

#### **Stream API**
1. Sign up at [GetStream.io](https://getstream.io/)
2. Create a new app
3. Get your API key and secret from the dashboard
4. Enable Video and Chat features

---

## 📁 Project Structure

```
SkillSync/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (admin)/             # Admin routes (Interviewer)
│   │   │   └── dashboard/       # Interview management dashboard
│   │   ├── (root)/              # Public routes
│   │   │   ├── (home)/          # Landing page
│   │   │   ├── meeting/[id]/    # Video call room
│   │   │   ├── schedule/        # Interview scheduling
│   │   │   └── recordings/      # Past interviews
│   │   ├── auth/                # Authentication pages
│   │   │   ├── signin/          # Sign in page
│   │   │   └── role-selection/  # Role selection after OAuth
│   │   ├── api/                 # API Routes
│   │   │   ├── auth/            # NextAuth endpoints
│   │   │   ├── interviews/      # Interview CRUD
│   │   │   ├── stream/          # Stream SDK tokens
│   │   │   └── users/           # User management
│   │   ├── globals.css          # Global styles
│   │   └── layout.tsx           # Root layout
│   ├── components/              # React components
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── motion/              # Framer Motion wrappers
│   │   ├── providers/           # Context providers
│   │   ├── CodeEditor.tsx       # Monaco Editor wrapper
│   │   ├── MeetingRoom.tsx      # Video call interface
│   │   ├── Navbar.tsx           # Navigation bar
│   │   └── ...                  # Other components
│   ├── constants/               # Constants and configs
│   │   └── index.ts             # Coding questions, actions, etc.
│   ├── hooks/                   # Custom React hooks
│   │   ├── useGetCallById.ts    # Fetch call details
│   │   ├── useGetCalls.ts       # Fetch user calls
│   │   └── useUserRole.ts       # Get user role
│   ├── lib/                     # Utility functions
│   │   └── utils.ts             # Helper functions
│   └── types/                   # TypeScript types
│       ├── index.ts             # Global types
│       └── next-auth.d.ts       # NextAuth type extensions
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── migrations/              # Database migrations
├── public/                      # Static assets
│   ├── javascript.png           # Language icons
│   ├── python.png
│   └── ...
├── scripts/                     # Utility scripts
│   └── seed-more.ts             # Database seeding
├── collaborative-server.js      # Express + Yjs server
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind config
├── next.config.mjs              # Next.js config
└── README.md                    # This file
```

---

## 🔌 API Endpoints

### **Authentication**
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signin` - Sign in with provider
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/register` - Register new user

### **Interviews**
- `GET /api/interviews` - List all interviews
- `POST /api/interviews` - Create new interview
- `GET /api/interviews/[id]` - Get interview by ID
- `PATCH /api/interviews/[id]` - Update interview status
- `POST /api/interviews/join` - Join interview by code

### **Stream Integration**
- `POST /api/stream/token` - Generate Stream Chat token
- `POST /api/stream/video/token` - Generate Stream Video token
- `POST /api/stream/channels/upsert` - Create/update chat channel

### **Users**
- `GET /api/users` - List all users
- `PATCH /api/users/role` - Update user role

### **Comments**
- `GET /api/db/comments?interviewId=X` - Get interview comments
- `POST /api/db/comments` - Add comment to interview

---

## 💾 Database Schema

```prisma
model User {
  id            String       @id @default(cuid())
  name          String?
  email         String?      @unique
  emailVerified DateTime?
  image         String?
  role          String       @default("candidate") // "interviewer" | "candidate"
  accounts      Account[]
  sessions      Session[]
  interviews    Interview[]
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model Interview {
  id              Int       @id @default(autoincrement())
  title           String
  startTime       BigInt
  callId          String    @unique // Stream call ID
  channelId       String?   @unique // Stream chat channel ID
  candidateId     String?
  interviewerId   String
  status          String    @default("upcoming") // "upcoming" | "completed" | "succeeded" | "failed"
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
  user            User      @relation(fields: [interviewerId], references: [id])
  comments        Comment[]
}

model Comment {
  id           Int       @id @default(autoincrement())
  content      String
  userId       String
  userName     String?
  userImage    String?
  interviewId  Int
  createdAt    DateTime  @default(now())
  interview    Interview @relation(fields: [interviewId], references: [id], onDelete: Cascade)
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### **ER Diagram**

```mermaid
erDiagram
    User ||--o{ Account : has
    User ||--o{ Session : has
    User ||--o{ Interview : organizes
    User ||--o{ Comment : writes
    Interview ||--o{ Comment : contains
    
    User {
        string id PK
        string name
        string email
        string role
    }
    
    Interview {
        int id PK
        string title
        bigint startTime
        string callId
        string status
    }
    
    Comment {
        int id PK
        string content
        datetime createdAt
    }
```

---

## 🎨 UI/UX Features

### **Design System**
- **Dark Theme**: Optimized for reduced eye strain during long interviews
- **Glassmorphism**: Modern frosted-glass effect on cards and panels
- **Gradient Accents**: Blue-to-purple gradients for emphasis
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Design**: Mobile-first approach, works on all devices

### **Key Screens**
1. **Landing Page**: Feature showcase, quick actions (New Call, Join Interview, Schedule, Recordings)
2. **Dashboard**: Interview management, question bank, candidate tracking
3. **Meeting Room**: Split-screen with video (left) and code editor (right)
4. **Schedule**: Calendar-based date/time picker
5. **Recordings**: Grid of past interview recordings

---

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

---

## 🚀 Deployment

### **Vercel (Recommended for Next.js)**

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### **Database (Production)**

Use managed PostgreSQL services:
- **Supabase** (Recommended, free tier available)
- **Neon** (Serverless PostgreSQL)
- **Railway** (Full-stack hosting)

### **Collaborative Server**

Deploy Express server separately:
- **Railway**
- **Heroku**
- **Render**

Update `COLLABORATIVE_SERVER_URL` in environment variables.

---

## 📝 Future Enhancements

- [ ] **AI Code Analysis**: Automated candidate code review with suggestions
- [ ] **Whiteboard**: Integrated drawing canvas for system design discussions
- [ ] **Email Notifications**: Automated interview reminders and status updates
- [ ] **Advanced Analytics**: Detailed interviewer/candidate performance metrics
- [ ] **Mobile App**: React Native mobile application
- [ ] **Screen Recording**: Separate screen recording alongside video
- [ ] **Code Execution**: Backend API for running and testing code
- [ ] **Multi-language Support**: Internationalization (i18n)
- [ ] **Interview Templates**: Pre-configured question sets by role/level
- [ ] **Feedback Forms**: Structured post-interview evaluation forms

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Shubham**
- GitHub: [@04shubham7](https://github.com/04shubham7)
- Email: shubham@example.com

---

## 🙏 Acknowledgments

- **Next.js** team for an amazing React framework
- **Vercel** for excellent hosting and developer experience
- **Prisma** for intuitive database tooling
- **Stream** for powerful video and chat SDKs
- **Monaco Editor** team for VS Code's editor core
- **Yjs** community for CRDT implementation
- **shadcn/ui** for beautiful component library

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**

⭐ Star this repository if you found it helpful!

</div>
