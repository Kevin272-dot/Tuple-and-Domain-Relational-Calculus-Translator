# API Documentation

## Groq API Integration

### Configuration
Add your Groq API key to `.env`:
```
VITE_GROQ_API_KEY=your_key_here
```

### Endpoints Used
- **Model:** `llama3-70b-8192`
- **Base URL:** `https://api.groq.com/openai/v1/chat/completions`

### AI Features

#### 1. Query Explainer
- **Component:** `AiExplainer.tsx`
- **Purpose:** Explains TRC/DRC queries in plain English
- **Parameters:** query, difficulty (beginner/intermediate/advanced)
- **Temperature:** 0.7
- **Max Tokens:** 600

#### 2. Error Corrector
- **Component:** `AiErrorCorrector.tsx`
- **Purpose:** Detects and corrects syntax errors
- **Parameters:** query
- **Temperature:** 0.3
- **Max Tokens:** 500

#### 3. Syntax Checker (AI Mode)
- **Component:** `SyntaxChecker.tsx`
- **Purpose:** Deep syntax analysis with suggestions
- **Parameters:** query, calculusType
- **Temperature:** 0.3
- **Max Tokens:** 500

#### 4. AI Chat Tutor
- **Component:** `AiChat.tsx`
- **Purpose:** Conversational Q&A about relational calculus
- **Parameters:** message history, current query context
- **Temperature:** 0.7
- **Max Tokens:** 400

#### 5. Query Generator
- **Component:** `AiQueryGenerator.tsx`
- **Purpose:** Generates TRC/DRC from natural language
- **Parameters:** description
- **Temperature:** 0.3
- **Max Tokens:** 300

### Rate Limiting
- Client-side rate limiting is recommended
- Handle 429 errors gracefully with user-friendly messages
- Never expose API keys in production builds

### Error Handling
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: Server error
- Network errors: Graceful degradation with offline mode
