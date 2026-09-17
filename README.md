# Tuple & Domain Relational Calculus Translator

An interactive educational web application that translates Tuple Relational Calculus (TRC) and Domain Relational Calculus (DRC) queries into equivalent SQL, with step-by-step visualization, AI-powered explanations, quizzes, and practice exercises.

## Features

### Core Translator
- **TRC to SQL Translation** — Write Tuple Relational Calculus queries and get equivalent SQL
- **DRC to SQL Translation** — Write Domain Relational Calculus queries and get equivalent SQL
- **Step-by-Step Visualization** — See the transformation pipeline with animated steps
- **Real-Time Syntax Highlighting** — Live parsing as you type with error detection
- **Interactive Relation Viewer** — Browse sample database tables with sortable grids

### Learning Tools
- **Concept Explanations** — Comprehensive TRC/DRC educational content
- **Embedded Videos** — Educational videos on relational calculus
- **References** — Books, websites, and research papers
- **Operator Reference** — Quick cheat sheet for all TRC/DRC operators

### Practice & Assessment
- **Quiz Mode** — 100+ MCQ questions with configurable filters and timer
- **Challenge Mode** — Timed translation challenges
- **Exercise List** — Practice exercises with explanations
- **Score Tracker** — Persistent score tracking across sessions
- **Spaced Repetition** — Optimal review scheduling for long-term retention

### AI-Powered Features (Groq API)
- **AI Query Explainer** — Break down queries in plain English at 3 difficulty levels
- **AI Error Corrector** — Detect and fix syntax errors with AI assistance
- **AI Query Generator** — Describe what you want in natural language, get TRC/DRC
- **AI Chat Tutor** — Floating chat widget for asking questions about relational calculus
- **Syntax Checker** — Dual-mode (local parser + AI) syntax validation

### Advanced Tools
- **Command Palette** (Ctrl+K) — Quick access to all features
- **Predicate Tree Diagram** — Visualize query structure as a tree
- **Equivalence Checker** — Compare two queries for logical equivalence
- **Schema Editor** — Create and edit database schemas within the app

### Utilities
- **Query History** — Automatic saving of last 50 queries
- **Download Reports** — Export as text or PDF with full execution details
- **Day/Night Mode** — Toggle between light and dark themes
- **Keyboard Shortcuts** — Full keyboard navigation support

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** CSS Transitions
- **AI Integration:** Groq API (llama3-70b-8192)
- **All logic runs client-side** — No backend server required

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/Tuple-and-Domain-Relational-Calculus-Translator.git
   cd Tuple-and-Domain-Relational-Calculus-Translator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file for AI features (optional):
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

### Translating Queries
1. Go to the **Simulator** tab
2. Select **TRC** or **DRC** mode
3. Enter your query in the text editor
4. Press **Ctrl+Enter** or click **Translate**
5. View the generated SQL and step-by-step breakdown

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| Ctrl+Enter | Translate query |
| Ctrl+K | Open command palette |
| Ctrl+D | Toggle dark mode |
| Ctrl+S | Download report |
| Ctrl+L | Clear input |
| Ctrl+1-4 | Switch tabs |

## Sample Queries

### TRC Examples
```
{T | T in Students AND T.age > 20}
{T.name | T in Students AND T.dept = 'CS'}
{T.name | exists E(E in Enrollment AND T.name = E.student AND E.course = 'DBMS')}
```

### DRC Examples
```
{<name, age> | <name, age, dept> in Students AND dept = 'CS'}
{<s> | exists c(<s, c> in Enrolls AND c = 'DBMS')}
```

## Project Structure

```
src/
├── engine/          # Core TRC/DRC parser and translator
├── components/      # React components (UI, simulator, learn, practice, AI, advanced)
├── pages/           # Page-level components
├── context/         # React context providers
├── hooks/           # Custom React hooks
└── utils/           # Utility functions
```

## Developer

- **Kevin Daniel** — 25BCE1823
- **Mentor:** Dr. Swaminathan A, Assistant Professor
- **Course:** Database Systems, VIT University

## License

This project is for educational purposes.
