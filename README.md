# 🚀 IncidentAI

**IncidentAI** is a professional, AI-powered incident management platform designed for modern DevOps and SRE teams. It streamlines the entire incident lifecycle—from detection and real-time collaboration to automated postmortem generation—using state-of-the-art Generative AI.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Real-time**: Socket.io-client

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Caching/Queue**: Redis (ioredis)
- **Authentication**: JWT, Passport.js (Google OAuth 2.0)
- **Real-time**: Socket.io
- **Payments**: Razorpay

### Artificial Intelligence
- **Orchestration**: LangChain
- **Models**: 
  - **Gemini 2.5 Flash** (Primary for speed/efficiency)
  - **Gemini 1.5 Pro** (Advanced reasoning fallback)
  - **Mistral AI** (Secondary fallback)
- **Capabilities**: Streaming responses, context-aware analysis.

---

## ✨ Key Features

### 1. Incident Management
- **Lifecycle Tracking**: Manage incidents through stages: `Investigating`, `Identified`, `Monitoring`, and `Resolved`.
- **Severity Levels**: Categorize issues by impact (Critical, High, Medium, Low).
- **Timeline**: Automatically logged audit trail of every action and update.

### 2. AI Intelligence
- **Auto-Summary**: Get instant, professional markdown summaries of complex incidents.
- **Root Cause Analysis (RCA)**: AI-driven hypotheses based on incident logs and timelines.
- **Automated Postmortems**: Generate blameless postmortem reports in seconds, ready for review.

### 3. Real-time Collaboration
- **Live Chat**: End-to-end encrypted real-time chat for responders within each incident.
- **Instant Notifications**: Stay updated with socket-driven alerts for status changes and team mentions.

### 4. Advanced Analytics
- **Performance Metrics**: Track Mean Time to Resolution (MTTR) and incident frequency.
- **Interactive Dashboards**: Neo-brutalist visualizations using Recharts to monitor infrastructure health.

### 5. Team & Service Management
- **Service Directory**: Track all microservices and infrastructure components.
- **Team Roles**: Manage permissions and assignments across the organization.

### 6. Billing & Subscriptions
- **Tiered Plans**: Free, Pro, and Enterprise tiers with varying AI limits and features.
- **Razorpay Integration**: Seamless upgrade and subscription management.

---

## 🤖 AI Workflow

IncidentAI uses a sophisticated multi-model fallback strategy to ensure high availability and intelligence:

1. **Request Triggered**: User requests a summary, RCA, or postmortem.
2. **Context Gathering**: The system collects incident metadata and the full timeline.
3. **Primary Model**: Attempts generation using **Gemini 2.5 Flash**.
4. **Fallback 1**: If Flash fails or hits limits, it automatically switches to **Gemini 1.5 Pro**.
5. **Fallback 2**: If both fail, it utilizes **Mistral AI** to ensure the user gets a response.
6. **Streaming UI**: Results are streamed back to the frontend in real-time for a smooth experience.

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB
- Redis Server

### Backend Setup
1. Navigate to the Backend directory:
   ```bash
   cd Backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your credentials:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   REDIS_HOST=127.0.0.1
   GEMINI_API_KEY=your_key
   RAZORPAY_KEY_ID=your_id
   RAZORPAY_KEY_SECRET=your_secret
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the Frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_RAZORPAY_KEY_ID=your_id
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🔄 Working Flow

1. **Onboarding**: User signs up via Email or Google OAuth.
2. **Dashboard**: View high-level infrastructure health and active incidents.
3. **Incident Creation**: A team member reports a service disruption.
4. **Investigation**: Responders use the **Real-time Chat** to collaborate.
5. **AI Assistance**: Responders trigger **AI Root Cause Analysis** to speed up resolution.
6. **Resolution**: Incident is marked as resolved; the timeline captures the final fix.
7. **Postmortem**: AI generates a draft **Postmortem Report** for the team to review and learn.
8. **Analysis**: Team reviews the **Analytics Dashboard** to prevent future occurrences.

---

## 📄 License
This project is licensed under the MIT License.
