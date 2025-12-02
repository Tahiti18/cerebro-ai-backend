/**
 * 🧠 CEREBRO AI BACKEND
 * Production-ready Express.js server with Claude 3.5 Sonnet integration
 * Adaptive learning API for the Cerebro educational platform
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  credentials: true
}));
app.use(express.json());
app.use(express.static('public'));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API root
app.get('/api', (req, res) => {
  res.json({
    name: 'Cerebro AI Backend',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      generate: 'POST /api/adaptive/generate',
      analytics: 'POST /api/adaptive/analytics',
      profile: 'GET /api/adaptive/profile/:studentId'
    },
    powered_by: 'Claude 3.5 Sonnet via OpenRouter'
  });
});

// 🚀 ADVANCED AI-POWERED ADAPTIVE LEARNING API
app.post('/api/adaptive/generate', async (req, res) => {
  try {
    const { level, subject, performance, questionHistory } = req.body;
    
    // Validate required fields
    if (!level || !subject) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: level and subject'
      });
    }
    
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('ERROR: OPENROUTER_API_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'API key not configured. Please set OPENROUTER_API_KEY environment variable.'
      });
    }
    
    // 📊 Calculate adaptive difficulty based on performance
    const avgAccuracy = performance?.accuracy || 0.5;
    const streak = performance?.streak || 0;
    
    let targetDifficulty = 'medio';
    if (avgAccuracy > 0.8 && streak >= 3) targetDifficulty = 'difícil';
    else if (avgAccuracy < 0.5 || streak < 0) targetDifficulty = 'fácil';
    
    // 🎓 Subject-specific LOMLOE competencies
    const competencyMap = {
      'Matemáticas': {
        fácil: 'STEM - Resolución de problemas básicos',
        medio: 'STEM - Razonamiento matemático aplicado',
        difícil: 'STEM - Modelización y pensamiento abstracto'
      },
      'Lengua': {
        fácil: 'CCL - Comprensión lectora básica',
        medio: 'CCL - Análisis textual y expresión',
        difícil: 'CCL - Interpretación crítica y argumentación'
      },
      'Ciencias': {
        fácil: 'CCL - Conocimiento científico básico',
        medio: 'STEM - Método científico y experimentación',
        difícil: 'STEM - Análisis científico avanzado'
      },
      'Historia': {
        fácil: 'CC - Conocimiento histórico fundamental',
        medio: 'CC - Análisis de procesos históricos',
        difícil: 'CC - Pensamiento histórico crítico'
      },
      'Inglés': {
        fácil: 'CCL - Comprensión básica de inglés',
        medio: 'CCL - Comunicación en inglés aplicada',
        difícil: 'CCL - Dominio avanzado del inglés'
      }
    };
    
    const lomloeCompetency = competencyMap[subject]?.[targetDifficulty] || 'Competencia general';
    
    // Build list of recent topics to avoid repetition
    const recentTopics = questionHistory 
      ? questionHistory.slice(-5).map(q => q.topic).filter(Boolean).join(', ')
      : '';
    
    // 🤖 Build intelligent prompt for Claude
    const systemPrompt = `Eres un profesor español experto en pedagogía adaptativa y el currículo LOMLOE. Generas preguntas educativas de alta calidad adaptadas al nivel y rendimiento del estudiante.

📚 CONTEXTO DEL ESTUDIANTE:
- Nivel educativo: ${level}
- Asignatura: ${subject}
- Rendimiento promedio: ${Math.round(avgAccuracy * 100)}%
- Racha actual: ${streak} ${streak >= 0 ? 'aciertos' : 'fallos'} consecutivos
- Dificultad objetivo: ${targetDifficulty}
- Competencia LOMLOE: ${lomloeCompetency}
${recentTopics ? `- Temas recientes (EVITA REPETIR): ${recentTopics}` : ''}

🎯 INSTRUCCIONES DE GENERACIÓN:
1. Genera UNA pregunta tipo test adaptada al nivel y rendimiento
2. La pregunta debe ser ${targetDifficulty} y apropiada para ${level}
3. Incluye 4 opciones de respuesta (A, B, C, D) - solo una correcta
4. Proporciona una explicación pedagógica clara (2-3 líneas)
5. La pregunta debe conectar con situaciones reales y prácticas
6. Usa lenguaje auténtico de España (no latinoamericanismos)
7. **IMPORTANTE**: Genera una pregunta sobre un tema DIFERENTE a los mencionados arriba

📋 FORMATO DE RESPUESTA EXACTO (JSON válido):
{
  "question": "Tu pregunta aquí",
  "options": ["Opción A completa", "Opción B completa", "Opción C completa", "Opción D completa"],
  "correctIndex": 0,
  "explanation": "Explicación pedagógica clara de 2-3 líneas",
  "difficulty": "${targetDifficulty}",
  "lomloeCompetency": "${lomloeCompetency}",
  "topic": "Tema específico de la pregunta"
}

⚠️ IMPORTANTE: Responde SOLO con el JSON, sin texto adicional antes o después.`;

    // 🌐 Call OpenRouter API with Claude 3.5 Sonnet
    console.log(`Generating question for ${level} - ${subject} (difficulty: ${targetDifficulty})`);
    
    const openRouterResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.APP_URL || 'https://cerebro-v10.netlify.app',
        'X-Title': 'Cerebro - Adaptive Learning Platform'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Genera la pregunta adaptativa ahora.' }
        ],
        temperature: 0.8,
        max_tokens: 800,
        top_p: 0.9
      })
    });

    if (!openRouterResponse.ok) {
      const errorText = await openRouterResponse.text();
      console.error('OpenRouter API error:', errorText);
      throw new Error(`OpenRouter API failed: ${openRouterResponse.statusText}`);
    }

    const data = await openRouterResponse.json();
    const aiContent = data.choices[0].message.content.trim();
    
    // 🔍 Parse AI response (handle markdown code blocks)
    let questionData;
    try {
      const jsonContent = aiContent
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      
      questionData = JSON.parse(jsonContent);
      
      // Validate required fields
      if (!questionData.question || !Array.isArray(questionData.options) || questionData.correctIndex === undefined) {
        throw new Error('Invalid question format from AI');
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', aiContent);
      throw new Error('AI generated invalid response format');
    }

    // 📈 Return enriched question with metadata
    res.json({
      success: true,
      question: questionData,
      metadata: {
        aiModel: 'claude-3.5-sonnet',
        targetDifficulty,
        adaptiveReason: avgAccuracy > 0.8 ? 'Alto rendimiento - aumentando dificultad' :
                        avgAccuracy < 0.5 ? 'Bajo rendimiento - reduciendo dificultad' :
                        'Rendimiento estable - manteniendo nivel',
        timestamp: new Date().toISOString(),
        usageTokens: data.usage || {}
      }
    });
    
  } catch (error) {
    console.error('Adaptive generation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Error generating adaptive content',
      details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
    });
  }
});

// 📊 API: Get performance analytics
app.post('/api/adaptive/analytics', async (req, res) => {
  try {
    const { history } = req.body;
    
    if (!history || history.length === 0) {
      return res.json({
        success: true,
        analytics: {
          totalQuestions: 0,
          accuracy: 0,
          averageDifficulty: 0,
          strengthAreas: [],
          improvementAreas: [],
          learningCurve: []
        }
      });
    }
    
    // Calculate metrics
    const correct = history.filter(q => q.correct).length;
    const accuracy = (correct / history.length) * 100;
    
    // Difficulty distribution
    const difficulties = history.map(q => {
      switch(q.difficulty) {
        case 'fácil': return 1;
        case 'medio': return 2;
        case 'difícil': return 3;
        default: return 2;
      }
    });
    const avgDifficulty = difficulties.reduce((a, b) => a + b, 0) / difficulties.length;
    
    // Performance by difficulty
    const byDifficulty = {
      fácil: { correct: 0, total: 0 },
      medio: { correct: 0, total: 0 },
      difícil: { correct: 0, total: 0 }
    };
    
    history.forEach(q => {
      const diff = q.difficulty || 'medio';
      byDifficulty[diff].total++;
      if (q.correct) byDifficulty[diff].correct++;
    });
    
    // Identify strengths and weaknesses
    const strengthAreas = [];
    const improvementAreas = [];
    
    for (const [diff, stats] of Object.entries(byDifficulty)) {
      if (stats.total > 0) {
        const acc = (stats.correct / stats.total) * 100;
        if (acc >= 75) strengthAreas.push({ level: diff, accuracy: Math.round(acc) });
        if (acc < 50) improvementAreas.push({ level: diff, accuracy: Math.round(acc) });
      }
    }
    
    // Learning curve (last 10 questions)
    const recent = history.slice(-10);
    const learningCurve = recent.map((q, idx) => ({
      question: idx + 1,
      correct: q.correct ? 1 : 0,
      difficulty: q.difficulty
    }));
    
    // Calculate current streak
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].correct) streak++;
      else break;
    }
    
    res.json({
      success: true,
      analytics: {
        totalQuestions: history.length,
        accuracy: Math.round(accuracy),
        correct,
        incorrect: history.length - correct,
        averageDifficulty: avgDifficulty.toFixed(1),
        byDifficulty,
        strengthAreas,
        improvementAreas,
        learningCurve,
        currentStreak: streak
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api',
      'POST /api/adaptive/generate',
      'POST /api/adaptive/analytics'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ 
    success: false, 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log('🧠 ========================================');
  console.log('🧠 CEREBRO AI BACKEND');
  console.log('🧠 ========================================');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🤖 AI Model: Claude 3.5 Sonnet`);
  console.log(`🔑 API Key: ${process.env.OPENROUTER_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log('🧠 ========================================');
});
