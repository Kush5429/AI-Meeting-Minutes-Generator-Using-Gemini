📋 AI Meeting Minutes Generator 🚀
Effortlessly transform meeting audio or text transcripts into structured, actionable meeting notes using the power of AI.

✅ Frontend: Next.js + Tailwind CSS
✅ Backend: Node.js + Express
✅ Transcription: AssemblyAI (free tier available)
✅ Summarization: Google Gemini (Generative AI)

✨ Features
Flexible Input: Upload audio (MP3, WAV, M4A, OGG) or paste a transcript.

Accurate Transcription: Uses AssemblyAI for high-quality speech-to-text.

Smart Summarization: Gemini organizes minutes into:

Attendees

Decisions Made

Key Discussion Points

Action Items

One-Click Email: Simulated feature to email minutes to participants.

Smooth UX: Beautiful UI, responsive design, and subtle animations with Framer Motion.

Robust: Handles large audio files and guides the user with clear feedback.

🗂️ Project Structure
ruby
Copy
Edit
ai-meeting-minutes-generator/
├── frontend/          # Next.js frontend
│   ├── pages/
│   ├── components/
│   ├── public/
│   ├── styles/
│   ├── .env.local     # Frontend env vars
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
└── backend/           # Express backend
    ├── server.js      # Main server
    ├── .env           # Backend env vars
    ├── package.json
    └── uploads/       # Temp audio files (auto-cleaned)
⚙️ Local Setup
✅ Prerequisites
Node.js (v18+ recommended)

npm or yarn

Google Gemini API key

AssemblyAI API key (free quota available)

1️⃣ Clone the Repo
bash
Copy
Edit
git clone https://github.com/your-username/ai-meeting-minutes-generator.git
cd ai-meeting-minutes-generator
2️⃣ Backend Setup
bash
Copy
Edit
cd backend
npm install
Create a .env file in /backend:

env
Copy
Edit
PORT=5000
GEMINI_API_KEY=YOUR_GOOGLE_GEMINI_API_KEY
ASSEMBLYAI_API_KEY=YOUR_ASSEMBLYAI_API_KEY
FRONTEND_URL=http://localhost:3000
Start the backend:

bash
Copy
Edit
npm run dev
🟢 Backend runs at http://localhost:5000

3️⃣ Frontend Setup
Open a new terminal tab:

bash
Copy
Edit
cd frontend
npm install
Create a .env.local in /frontend:

env
Copy
Edit
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
Start the frontend:

bash
Copy
Edit
npm run dev
🟢 Frontend runs at http://localhost:3000

🚀 Deployment
✅ 1. Deploy Frontend (Vercel)
Push your repo to GitHub.

Sign in to Vercel and import the repo.

Set Root Directory to /frontend.

Add NEXT_PUBLIC_BACKEND_URL in Vercel Environment Variables — point it to your production backend URL (Railway, Render, etc.).

Click Deploy!

✅ 2. Deploy Backend (Railway)
Sign in to Railway and link your repo.

Set the backend folder (/backend) as the service root.

Add:

GEMINI_API_KEY

ASSEMBLYAI_API_KEY

FRONTEND_URL → your live Vercel URL

Deploy!

Grab the Railway backend URL and update it in Vercel (NEXT_PUBLIC_BACKEND_URL).

✅ Demo Workflow
Upload Audio → AssemblyAI transcribes it.

Gemini processes the transcript and returns structured JSON.

Frontend displays the minutes in a beautiful grid.

Send Email → Simulated for now (plug in SendGrid, Nodemailer for production).

⚠️ Troubleshooting
🔑 Common Issues
Issue	Fix
GEMINI_API_KEY is missing	Add your Gemini key to .env
ASSEMBLYAI_API_KEY is missing	Add your AssemblyAI key to .env
EADDRINUSE: address already in use	Kill any process using the port: lsof -i :5000 then kill -9 PID
Frontend can't connect to backend	Check NEXT_PUBLIC_BACKEND_URL and CORS FRONTEND_URL
Next.js build error for @lucide/react	npm cache clean --force then reinstall

🙌 Credits
AssemblyAI — Free speech-to-text API

Google Gemini — Generative summarization

Next.js — React framework

Tailwind CSS — Modern styling

Framer Motion — Smooth animations

📄 License
MIT — free to use & modify.
Star ⭐️ the repo if you find it helpful!

🔗 Happy Note-Taking!
💡 Questions? Issues?
Create an Issue or reach out!