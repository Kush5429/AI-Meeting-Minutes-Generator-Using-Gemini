require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const axios = require('axios');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5001;

// ✅ CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ✅ Multer
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 25 * 1024 * 1024 },
});

// ✅ Gemini
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  console.error("❌ GEMINI_API_KEY missing");
  process.exit(1);
}
const genAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ✅ AssemblyAI
const assemblyApiKey = process.env.ASSEMBLYAI_API_KEY;
if (!assemblyApiKey) {
  console.error("❌ ASSEMBLYAI_API_KEY missing");
  process.exit(1);
}

// ✅ Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // 👉 This must be a Gmail App Password
  },
});

// ✅ Gemini output formatter
function formatGeminiOutput(text) {
  try {
    text = text.trim();
    if (text.startsWith('```')) {
      text = text.replace(/^```[a-z]*\n?/i, '').replace(/```$/, '');
    }
    return JSON.parse(text);
  } catch {
    // fallback parsing
    const sections = {
      Attendees: "Attendees:",
      DecisionsMade: "Decisions Made:",
      KeyDiscussionPoints: "Key Discussion Points:",
      ActionItems: "Action Items:"
    };
    const minutes = {};
    for (const key in sections) {
      const start = sections[key];
      const nextKeys = Object.keys(sections).slice(Object.keys(sections).indexOf(key) + 1);
      let startIdx = text.indexOf(start);
      if (startIdx !== -1) {
        startIdx += start.length;
        let endIdx = text.length;
        for (const nextKey of nextKeys) {
          const nextIdx = text.indexOf(sections[nextKey], startIdx);
          if (nextIdx !== -1 && nextIdx < endIdx) endIdx = nextIdx;
        }
        const content = text.substring(startIdx, endIdx).trim();
        minutes[key] = content.split('\n').map(l => l.replace(/^[\s\d*-]+\s*/, '').trim()).filter(Boolean);
      }
    }
    return minutes;
  }
}

// ✅ AssemblyAI Transcriber
async function transcribeWithAssemblyAI(filePath) {
  const fileData = fs.readFileSync(filePath);

  // Upload
  const uploadRes = await axios.post(
    'https://api.assemblyai.com/v2/upload',
    fileData,
    {
      headers: {
        authorization: assemblyApiKey,
        'Transfer-Encoding': 'chunked',
      },
    }
  );
  const audioUrl = uploadRes.data.upload_url;

  // Transcribe
  const transcriptRes = await axios.post(
    'https://api.assemblyai.com/v2/transcript',
    { audio_url: audioUrl },
    { headers: { authorization: assemblyApiKey } }
  );
  const transcriptId = transcriptRes.data.id;

  // Poll
  let status = 'processing';
  let text = '';
  while (status === 'processing' || status === 'queued') {
    await new Promise(r => setTimeout(r, 3000));
    const pollingRes = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      { headers: { authorization: assemblyApiKey } }
    );
    status = pollingRes.data.status;
    if (status === 'completed') text = pollingRes.data.text;
    if (status === 'failed') throw new Error(pollingRes.data.error);
  }
  return text;
}

// ✅ Generate route
app.post('/api/minutes/generate', upload.single('audio'), async (req, res) => {
  try {
    let transcript = '';
    if (req.file) {
      transcript = await transcribeWithAssemblyAI(req.file.path);
      fs.unlink(req.file.path, () => {});
    } else if (req.body.transcript) {
      transcript = req.body.transcript;
    } else {
      return res.status(400).json({ error: "No audio or transcript provided." });
    }

    const prompt = `
Respond only with valid JSON. No markdown.

{
  "attendees": [],
  "decisionsMade": [],
  "keyDiscussionPoints": [],
  "actionItems": []
}

Transcript:
${transcript}
`;

    const result = await geminiModel.generateContent(prompt);
    const geminiText = result.response.text();
    const minutes = formatGeminiOutput(geminiText);
    res.status(200).json({ minutes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Email route
app.post('/api/minutes/send-email', async (req, res) => {
  const { recipients, minutes } = req.body;
  if (!recipients || !minutes) {
    return res.status(400).json({ error: "Recipients & minutes required." });
  }

  try {
    const html = `
      <h2>Meeting Minutes</h2>
      <h3>Attendees</h3><ul>${minutes.attendees.map(a => `<li>${a}</li>`).join('')}</ul>
      <h3>Decisions Made</h3><ul>${minutes.decisionsMade.map(d => `<li>${d}</li>`).join('')}</ul>
      <h3>Key Discussion Points</h3><ul>${minutes.keyDiscussionPoints.map(p => `<li>${p}</li>`).join('')}</ul>
      <h3>Action Items</h3><ul>${minutes.actionItems.map(a => `<li>${a}</li>`).join('')}</ul>
    `;

    await transporter.sendMail({
      from: `"Meeting Minutes Bot" <${process.env.EMAIL_USER}>`,
      to: recipients,
      subject: 'Your AI-Generated Meeting Minutes',
      html,
    });

    res.status(200).json({ message: "Email sent successfully." });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send email." });
  }
});

// ✅ Health check
app.get('/', (req, res) => {
  res.send('✅ AI Meeting Minutes Backend is running!');
});

app.listen(port, () => {
  console.log(`✅ Server listening at http://localhost:${port}`);
});
