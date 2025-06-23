# 📋 AI Meeting Minutes Generator 🚀

Effortlessly transform meeting audio or transcripts into structured, actionable meeting notes using the power of **AI**.

---

## ✅ Tech Stack

- **Frontend:** Next.js + Tailwind CSS + Framer Motion  
- **Backend:** Node.js + Express  
- **Transcription:** [AssemblyAI](https://www.assemblyai.com/)  
- **Summarization:** [Google Gemini](https://deepmind.google)

---

## ✨ Features

- 🎙️ **Flexible Input:** Upload audio (`.mp3`, `.wav`, `.m4a`, `.ogg`) or paste a transcript.
- 📝 **Accurate Transcription:** High-quality speech-to-text via AssemblyAI.
- 🧠 **Smart Summarization:** Gemini organizes notes into:
  - Attendees  
  - Decisions Made  
  - Key Discussion Points  
  - Action Items  
- 📧 **One-Click Email:** Simulated email sending (extendable to production).
- 🎨 **Smooth UX:** Clean, responsive UI with subtle animations.
- 🗂️ **Robust:** Handles large audio files with clear user feedback.

---

## 🗂️ Project Structure

```plaintext
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

AssemblyAI API key (free tier available)


