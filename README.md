# 🧠 Cerebro AI Backend

**Production-ready Express.js server with Claude 3.5 Sonnet integration for adaptive learning**

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

---

## 🚀 Features

- ✅ **Real AI Generation** - Claude 3.5 Sonnet via OpenRouter
- ✅ **Adaptive Difficulty** - Dynamic adjustment based on student performance
- ✅ **Performance Analytics** - Real-time tracking and insights
- ✅ **LOMLOE Integration** - Authentic Spanish curriculum competencies
- ✅ **Production-Ready** - Helmet, CORS, compression, error handling
- ✅ **Railway-Optimized** - Ready for instant deployment

---

## 📦 Quick Deploy to Railway (iPad-Friendly!)

### Step 1: Push to GitHub (Already Done!)

This repo is already on GitHub at: `https://github.com/Tahiti18/cerebro-ai-backend`

### Step 2: Deploy to Railway

1. **Go to:** https://railway.app/
2. **Sign in** with GitHub
3. **Click:** "New Project"
4. **Select:** "Deploy from GitHub repo"
5. **Choose:** `Tahiti18/cerebro-ai-backend`
6. **Click:** "Deploy Now"

### Step 3: Add Environment Variables

After deployment starts, add these variables:

1. **Click** on your project
2. **Go to:** "Variables" tab
3. **Add these:**

```bash
OPENROUTER_API_KEY=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
NODE_ENV=production
ALLOWED_ORIGINS=https://cerebro-v10.netlify.app
APP_URL=https://cerebro-v10.netlify.app
```

4. **Click:** "Save" (Railway will auto-redeploy)

### Step 4: Get Your API URL

1. **Go to:** "Settings" tab
2. **Find:** "Domains" section
3. **Copy:** Your Railway URL (e.g., `https://cerebro-ai-backend.up.railway.app`)

### Step 5: Test It!

```bash
# Test health endpoint
curl https://your-railway-url.up.railway.app/health

# Test AI generation
curl -X POST https://your-railway-url.up.railway.app/api/adaptive/generate \
  -H "Content-Type: application/json" \
  -d '{"level":"ESO","subject":"Matemáticas","performance":{"accuracy":0.75,"streak":2}}'
```

---

## 🔧 API Endpoints

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-12-02T...",
  "uptime": 12345
}
```

---

### `POST /api/adaptive/generate`
Generate adaptive AI question

**Request Body:**
```json
{
  "level": "ESO",
  "subject": "Matemáticas",
  "performance": {
    "accuracy": 0.75,
    "streak": 2
  },
  "questionHistory": []
}
```

**Response:**
```json
{
  "success": true,
  "question": {
    "question": "¿Cuánto es 2x + 5 = 15?",
    "options": ["x = 3", "x = 5", "x = 7", "x = 10"],
    "correctIndex": 1,
    "explanation": "Para resolver...",
    "difficulty": "medio",
    "lomloeCompetency": "STEM - Razonamiento matemático",
    "topic": "Ecuaciones lineales"
  },
  "metadata": {
    "aiModel": "claude-3.5-sonnet",
    "targetDifficulty": "medio",
    "adaptiveReason": "Rendimiento estable",
    "timestamp": "2025-12-02T...",
    "usageTokens": { "total_tokens": 761 }
  }
}
```

---

### `POST /api/adaptive/analytics`
Get performance analytics

**Request Body:**
```json
{
  "history": [
    { "correct": true, "difficulty": "fácil" },
    { "correct": true, "difficulty": "medio" },
    { "correct": false, "difficulty": "difícil" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalQuestions": 3,
    "accuracy": 67,
    "correct": 2,
    "incorrect": 1,
    "averageDifficulty": "2.0",
    "byDifficulty": { ... },
    "strengthAreas": [ ... ],
    "improvementAreas": [ ... ],
    "learningCurve": [ ... ],
    "currentStreak": 0
  }
}
```

---

## 🔑 Environment Variables

Required variables (set in Railway):

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENROUTER_API_KEY` | OpenRouter API key (REQUIRED) | `sk-or-v1-...` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port (Railway auto-sets) | `3000` |
| `ALLOWED_ORIGINS` | CORS allowed origins | `https://cerebro-v10.netlify.app` |
| `APP_URL` | Your frontend URL | `https://cerebro-v10.netlify.app` |

---

## 🧪 Local Development

```bash
# Clone the repo
git clone https://github.com/Tahiti18/cerebro-ai-backend.git
cd cerebro-ai-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env and add your OPENROUTER_API_KEY

# Start development server
npm run dev

# Test locally
curl http://localhost:3000/health
```

---

## 📊 Cost Estimation

**OpenRouter (Claude 3.5 Sonnet):**
- ~$0.005 per question
- Your key has ~$10.42 remaining
- Estimated: ~2,000 questions available

**Railway:**
- $5/month for 500 hours
- Free tier: $5 credit/month
- Should cover light-medium usage

---

## 🔗 Integration with Frontend

Update your Netlify frontend to point to Railway backend:

**In your frontend JavaScript:**
```javascript
const API_URL = 'https://your-railway-url.up.railway.app';

// Generate question
const response = await fetch(`${API_URL}/api/adaptive/generate`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ level, subject, performance })
});
```

---

## 🚨 Troubleshooting

### Issue: "API key not configured"
**Solution:** Set `OPENROUTER_API_KEY` in Railway Variables tab

### Issue: CORS errors
**Solution:** Add your frontend URL to `ALLOWED_ORIGINS` variable

### Issue: Railway deployment fails
**Solution:** Check Railway build logs, ensure all files committed

### Issue: API returns 500
**Solution:** Check Railway logs, verify API key balance at https://openrouter.ai/account

---

## 📖 Documentation

- **OpenRouter Docs:** https://openrouter.ai/docs
- **Railway Docs:** https://docs.railway.app/
- **Express.js Docs:** https://expressjs.com/

---

## 🎉 You're Done!

Your AI backend is now:
- ✅ Running on Railway
- ✅ Generating real AI questions
- ✅ Adapting to student performance
- ✅ Tracking analytics
- ✅ Production-ready

**Next:** Update your frontend to use the Railway API URL! 🚀

---

## 👤 Author

**@Tahiti18**

## 📄 License

MIT
