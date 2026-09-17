# AGENTS.md — Complete Project Guide for AI Agents

> **Purpose**: This document is the single source of truth for any AI agent (including new sessions) working on this project. Read this file in its entirety before writing any code, making any changes, or responding to any user query about this project.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Repository State](#2-repository-state)
3. [Technology Stack](#3-technology-stack)
4. [Project Objectives](#4-project-objectives)
5. [Core Concept: TRC & DRC](#5-core-concept-trc--drc)
6. [Mandatory Website Sections](#6-mandatory-website-sections)
7. [Evaluation Criteria](#7-evaluation-criteria)
8. [Development Phases](#8-development-phases)
9. [UI/UX Design Guidelines](#9-uiux-design-guidelines)
10. [Developer Information](#10-developer-information)
11. [Innovative Features to Implement](#11-innovative-features-to-implement)
12. [File & Folder Structure (Target)](#12-file--folder-structure-target)
13. [AI Integration Plan](#13-ai-integration-plan)
14. [Testing Requirements](#14-testing-requirements)
15. [Documentation Requirements](#15-documentation-requirements)
16. [Rules & Constraints](#16-rules--constraints)
17. [Common Pitfalls to Avoid](#17-common-pitfalls-to-avoid)
18. [Checklist for Every Agent Session](#18-checklist-for-every-agent-session)

---

## 1. Project Overview

**Project Name**: Tuple & Domain Relational Calculus Translator

**Course**: Database Systems — VIT University

**Student**: Kevin Daniel, Register Number: 25BCE1823

**Mentor**: Dr. Swaminathan A, Assistant Professor

**Contact**: lrkevindaniel@gmail.com

**What This Project Is**: An interactive educational web application that:
- Accepts Tuple Relational Calculus (TRC) and Domain Relational Calculus (DRC) queries as input
- Translates them into equivalent SQL queries
- Visualizes the translation process step-by-step
- Explains the concepts to users
- Provides AI-assisted guidance for learning
- Supports practice modes, quizzes, and assessments

**What This Project Is NOT**: This is NOT a database engine. It does NOT execute SQL against a live database. It is a TRANSLATOR and EDUCATIONAL tool that shows how TRC/DRC map to SQL.

---

## 2. Repository State

**Current Status**: EMPTY — only 2 files exist.

```
Tuple-and-Domain-Relational-Calculus-Translator/
├── .gitignore          (default AL/Dynamics 365 template — needs replacing)
└── README.md           (contains only the project title)
```

- **Git commits**: 1 (initial commit, Aug 22, 2026)
- **Branch**: `main`
- **No source code, no configuration, no dependencies, no tests exist.**

Every agent must understand: you are building from scratch. There is no existing codebase to reference.

---

## 3. Technology Stack

### Frontend (MANDATORY)
- **React** with TypeScript
- **Vite** as build tool
- **Tailwind CSS** for styling
- **Lucide React** for icons ONLY (no emoji icons anywhere)
- **NO** Material UI, Bootstrap, Chakra, or other component libraries
- **NO** emoji characters anywhere in the UI

### Backend / Logic
- **Pure TypeScript** for the TRC/DRC parser and translator
- **No separate backend server** — all logic runs client-side
- **Groq API** integration for AI features (API key provided by user)

### Package Manager
- **npm** (use `npm install`, not yarn or pnpm)

### Version Control
- **Git** with GitHub remote

---

## 4. Project Objectives

1. **Educate** users about Tuple Relational Calculus (TRC) and Domain Relational Calculus (DRC)
2. **Translate** TRC/DRC expressions into equivalent SQL queries
3. **Visualize** the translation process step-by-step with animations
4. **Explain** concepts through interactive learning materials
5. **Assess** user understanding through quizzes and practice exercises
6. **Assist** users with AI-powered guidance using Groq API
7. **Generate** downloadable reports of user activity and results

---

## 5. Core Concept: TRC & DRC

### Tuple Relational Calculus (TRC)
- Variables range over **tuples** (rows) of relations
- Syntax: `{T | condition(T)}`
- Example: `{T | T.student_name = 'Alice' ∧ T.course = 'DBMS'}`
- Operators: `∀` (for all), `∃` (exists), `∈` (in), `∧` (and), `∨` (or), `¬` (not), `→` (implies), `↔` (if and only if)

### Domain Relational Calculus (DRC)
- Variables range over **domains** (column values) of relations
- Syntax: `{<v1, v2, ..., vn> | condition(v1, v2, ..., vn)}`
- Example: `{<sname> | ∃c(<sname, c> ∈ Student ∧ c = 'DBMS')}`

### Translation to SQL
| TRC/DRC Concept | SQL Equivalent |
|---|---|
| `{T | P(T)}` | `SELECT * FROM R WHERE P` |
| `{T.name | P(T)}` | `SELECT T.name FROM R WHERE P` |
| `∃T(P(T))` | `EXISTS (SELECT * FROM R WHERE P)` |
| `∀T(P(T))` | `NOT EXISTS (SELECT * FROM R WHERE NOT P)` |
| `T ∈ R` | `FROM R` or `IN R` |
| `∧` | `AND` |
| `∨` | `OR` |
| `¬` | `NOT` |
| `→` | `NOT ... OR` (material implication) |
| `↔` | equivalence rewrite |

---

## 6. Mandatory Website Sections

The application MUST include ALL of the following tabs/sections in the navigation bar. Failure to include any one of them results in marks deduction.

### 6.1 Learn Tab
**Location**: Prominent in top-right of navigation bar

**Required Components**:
1. **Concept Explanation**
   - Explain TRC concept clearly and concisely
   - Explain DRC concept clearly and concisely
   - Explain relationship between TRC, DRC, and SQL
   - Use well-organized content with headings, subheadings
   - Reference textbooks and academic sources
   - Content must be crisp, clear, easy to understand

2. **Animated Video**
   - Embed a relevant educational video (YouTube or similar)
   - Must help users understand the concept visually
   - Topic: relational calculus, database queries, or similar

3. **References**
   - Books (with title, author, edition)
   - Websites (with URLs)
   - Research papers (with citations)
   - Educational resources
   - Videos used
   - Proper acknowledgement of all sources is MANDATORY

### 6.2 Simulator Tab (Main Feature)
- The core TRC/DRC to SQL translator
- Input area for queries
- Translation output
- Visualization of the process
- Interactive controls

### 6.3 Practice Tab
- Exercises and challenges
- Randomized problems
- Scoring system
- Feedback on answers

### 6.4 Builder Tab (Developer Info)
**Contains**:
1. **Developer Details**:
   - Photo (placeholder for now — will be uploaded later)
   - Name: Kevin Daniel
   - Register Number: 25BCE1823
   - Contact: lrkevindaniel@gmail.com
2. **Section separator line** (horizontal rule)
3. **Mentor Details**:
   - Photo (placeholder for now — will be uploaded later)
   - Name: Dr. Swaminathan A
   - Title: Assistant Professor
4. **Presentation**: Displayed as a MODAL (not a separate page), triggered from the navbar

### 6.5 Help Tab
**Functions as user manual**. Must explain:
- What the website/application does
- What inputs are available
- How to provide inputs
- What each button/control does
- How processing takes place
- How to interpret the output
- Step-by-step instructions
- Written so a FIRST-TIME user can operate the website

### 6.6 Download Feature
**When clicked, generates report containing**:
- User Inputs
- Processing Steps
- Intermediate Results (where applicable)
- Final Output
- Graphs, Tables, Figures (if applicable)
- Download options: PDF, Document, Text
- Must clearly document complete execution

### 6.7 Day/Night Mode Toggle
- Toggle between Day Mode (light theme) and Night Mode (dark theme)
- Interface must remain readable and user-friendly in BOTH modes
- Toggle should be accessible from the navigation bar

---

## 7. Evaluation Criteria

| Criteria | Marks | What Must Be Demonstrated |
|---|---|---|
| Problem Understanding & Requirements | 1 | Clear understanding of TRC/DRC, objectives, inputs, outputs, functional requirements |
| Core Functionality & Technical Implementation | 2 | Proper implementation of translator, correct algorithms, correct input processing, appropriate outputs |
| Website Structure & Mandatory Sections | 1 | All mandatory sections (Learn, Builder, Help, Download, Day/Night) present and functional |
| System Design & UI/UX | 1 | Proper module organization, logical navigation, user-friendly interface, clear layout, consistent design |
| Demonstration & Explanation | 1 | Working website demo, explain major modules, inputs/outputs, core functionality, technical implementation |
| Testing & Project Progress | 2 | Sufficient progress, testing with appropriate inputs, correct case handling, error handling, output verification |
| Creativity & Innovation | 2 | Innovative presentation, additional features, creative visualization, improved interaction, unique approaches |
| **TOTAL** | **10** | |

### For Creativity & Innovation (2 marks)
Simply implementing mandatory requirements is NOT enough. Must demonstrate:
- Innovative presentation of concepts
- Additional useful features beyond requirements
- Creative visualization approaches
- Improved user interaction patterns
- Unique approaches to solving the translation problem

---

## 8. Development Phases

Follow these phases IN ORDER. Do NOT skip ahead.

### Phase 1: Requirement Analysis
- Finalize objectives, inputs, outputs, workflows
- Define the complete feature set
- Document all user stories

### Phase 2: UI Prototype
- Prepare wireframes for every page/tab
- Create clickable prototype
- Get feedback on layout before coding

### Phase 3: Core Engine
- Implement TRC parser
- Implement DRC parser
- Implement SQL translator
- Implement validation rules
- Test with sample queries

### Phase 4: Visualization
- Connect translation logic to diagrams
- Create step-by-step animation
- Build interactive result tables
- Add tuple highlighting

### Phase 5: Practice Mode
- Add exercises with randomization
- Implement scoring system
- Add feedback mechanisms
- Create difficulty levels

### Phase 6: Persistence
- Store saved queries, history, scores
- Implement local storage or state management
- Generate reports

### Phase 7: Testing
- Functional testing
- Boundary testing
- Usability testing
- Performance testing
- Error handling testing

### Phase 8: Documentation
- User manual
- Architecture documentation
- Test cases documentation
- Screenshots
- Demo preparation

### Phase 9: Advanced Features
- AI integration (Groq API)
- Analytics
- Only add AFTER core system is stable

---

## 9. UI/UX Design Guidelines

### General Rules
- **NO EMOJI** anywhere in the UI — use Lucide React icons instead
- **Clean, bright, professional** design
- **Lucide React** is the ONLY icon library
- Consistent spacing, typography, and color palette
- Responsive design (works on desktop and tablet minimum)

### Color Palette

#### Light Mode (Day)
- Background: `#FFFFFF` (white) or `#F8FAFC` (slight gray)
- Primary: `#2563EB` (blue)
- Secondary: `#7C3AED` (purple)
- Text: `#1E293B` (dark slate)
- Muted text: `#64748B`
- Border: `#E2E8F0`
- Success: `#22C55E`
- Error: `#EF4444`
- Warning: `#F59E0B`
- Card background: `#FFFFFF`
- Code background: `#F1F5F9`

#### Dark Mode (Night)
- Background: `#0F172A` (dark navy)
- Primary: `#3B82F6` (lighter blue)
- Secondary: `#8B5CF6` (lighter purple)
- Text: `#F1F5F9` (light)
- Muted text: `#94A3B8`
- Border: `#1E293B`
- Success: `#4ADE80`
- Error: `#F87171`
- Warning: `#FBBF24`
- Card background: `#1E293B`
- Code background: `#1E293B`

### Typography
- Headings: Inter or system font, bold
- Body: Inter or system font, regular
- Code: JetBrains Mono or Fira Code, monospace
- Minimum body text: 14px
- Line height: 1.5 for body, 1.2 for headings

### Layout
- Maximum content width: 1280px, centered
- Navigation bar: fixed at top, with logo, tabs, and mode toggle
- Consistent padding: 16px or 24px
- Card-based layout for content sections
- Proper visual hierarchy with headings

### Navigation Bar
- Left: Logo/Project name
- Center: Tabs (Simulator, Learn, Practice, Help)
- Right: Builder (triggers modal), Day/Night toggle
- Active tab highlighted with primary color
- Smooth transitions on hover/click

### Builder Modal
- Triggered by clicking "Builder" in navbar
- Large modal overlay (not a new page)
- Contains:
  - Developer photo (placeholder), name, reg number, contact
  - Horizontal separator line
  - Mentor photo (placeholder), name, title
- Close button in top-right corner
- Click outside to close

### Animations
- Use Framer Motion for page transitions
- Use CSS transitions for hover effects
- Keep animations subtle (200-300ms duration)
- No distracting or excessive animations

---

## 10. Developer Information

### Student (Builder)
- **Name**: Kevin Daniel
- **Register Number**: 25BCE1823
- **Email**: lrkevindaniel@gmail.com
- **Photo**: Placeholder (will be uploaded later)
- **Role**: Developer

### Mentor
- **Name**: Dr. Swaminathan A
- **Title**: Assistant Professor
- **Photo**: Placeholder (will be uploaded later)

### Placement in UI
- Accessible via "Builder" button in navigation bar
- Opens as a large modal overlay
- Developer details on top
- Horizontal separator line
- Mentor details below
- Photos will be provided later — use placeholder avatars for now

---

## 11. Innovative Features to Implement

These are the features that will earn creativity marks. Prioritize P0 features first.

### P0 — Must Implement (Core Differentiators)

#### 11.1 Real-Time Syntax Highlighting & Error Detection
- Live parsing as user types TRC/DRC queries
- Syntax errors highlighted inline with explanations
- Auto-suggest for valid operators
- Use a custom tokenizer/lexer for TRC/DRC syntax

#### 11.2 Step-by-Step Translation Visualization
- Show the transformation pipeline: TRC/DRC → SQL with intermediate steps
- Animated flow diagram showing how each calculus operation maps to SQL constructs
- Highlight which part of the query is being translated at each step
- Use numbered steps with visual indicators

#### 11.3 Interactive Relation Viewer
- Display database tables as interactive, sortable, filterable grids
- Click on a tuple to see which calculus conditions it satisfies/fails
- Color-coded rows: green = selected by query, red = rejected
- Hover to see why a tuple was included/excluded

#### 11.4 AI Query Explainer (Groq API)
- Paste any TRC/DRC query → AI breaks it down in plain English
- "Explain this query like I'm 5" mode
- Multi-level explanations: beginner → intermediate → advanced
- Integration with Groq API (user will provide API key)

### P1 — Should Implement (High Learning Value)

#### 11.5 Guided Tutorial Mode
- Interactive walkthrough for beginners
- Step 1: Explain what TRC is with examples
- Step 2: Show a simple query
- Step 3: Let user modify it and see results
- Progressive difficulty levels

#### 11.6 Quiz & Assessment System
- Multiple choice questions on TRC/DRC concepts
- "Predict the result" challenges (given a query, guess the output)
- "Fix the query" challenges (given wrong query, correct it)
- Score tracking with difficulty-based points

#### 11.7 Challenge Mode
- Timed challenges: "Translate this SQL to TRC in 2 minutes"
- Daily challenges
- Achievement badges for completing milestones

#### 11.8 Comprehensive PDF Report Generation
- Generated report includes:
  - Input query
  - Translation steps
  - Intermediate representations
  - Final SQL output
  - Result table
  - Visualization screenshots
  - Explanation summary
- Use a library like `html2pdf.js` or `jspdf`

### P2 — Nice to Have (Professional Polish)

#### 11.9 Command Palette (Ctrl+K)
- Quick access to all features
- "Load example", "Switch to dark mode", "Export PDF"
- Search across all queries and results

#### 11.10 Query History with Search
- All previous queries saved automatically (localStorage)
- Search through history
- Re-run, edit, or export any previous query

#### 11.11 Schema Editor
- Create/edit database schemas within the app
- Define tables, columns, data types
- Populate with sample data
- Use custom schemas for queries

#### 11.12 Equivalence Checker
- Input two queries → verify if they are logically equivalent
- Uses set theory to prove or disprove equivalence
- Shows counterexample if not equivalent

### P3 — If Time Permits

#### 11.13 Predicate Tree Diagram
- Parse TRC/DRC expressions into a tree structure
- Show operator precedence visually
- Click on any node to see its sub-result

#### 11.14 Common Mistakes Database
- Catalog of frequent errors students make
- Show incorrect query → explain why it's wrong → show correct version

#### 11.15 AI Query Generator
- Describe what you want in natural language → AI generates TRC/DRC
- "Find all students who scored above 90" → translates to proper calculus notation

#### 11.16 Spaced Repetition Review
- System tracks which concepts user struggles with
- Recommends practice problems at optimal intervals

---

## 12. File & Folder Structure (Target)

```
Tuple-and-Domain-Relational-Calculus-Translator/
├── .gitignore                      (replace with Node/React template)
├── README.md                       (comprehensive project README)
├── AGENTS.md                       (this file)
├── package.json                    (project dependencies)
├── tsconfig.json                   (TypeScript config)
├── tailwind.config.js              (Tailwind CSS config)
├── vite.config.ts                  (Vite config)
├── index.html                      (entry HTML)
├── public/
│   ├── favicon.ico
│   └── placeholder-avatar.png      (default avatar for Builder)
├── src/
│   ├── main.tsx                    (React entry point)
│   ├── App.tsx                     (Root component, routing)
│   ├── index.css                   (Global styles, Tailwind imports)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx          (Navigation bar)
│   │   │   ├── Footer.tsx          (Footer)
│   │   │   └── Layout.tsx          (Main layout wrapper)
│   │   ├── ui/
│   │   │   ├── Button.tsx          (Reusable button)
│   │   │   ├── Card.tsx            (Reusable card)
│   │   │   ├── Modal.tsx           (Reusable modal)
│   │   │   ├── Tabs.tsx            (Reusable tabs)
│   │   │   ├── Input.tsx           (Reusable input)
│   │   │   ├── Toggle.tsx          (Day/Night toggle)
│   │   │   ├── Tooltip.tsx         (Reusable tooltip)
│   │   │   ├── CodeEditor.tsx      (Code input with syntax highlighting)
│   │   │   └── DataTable.tsx       (Sortable data table)
│   │   ├── simulator/
│   │   │   ├── QueryInput.tsx      (TRC/DRC query input area)
│   │   │   ├── TranslationOutput.tsx (SQL output display)
│   │   │   ├── StepByStep.tsx      (Step-by-step translation view)
│   │   │   ├── RelationViewer.tsx  (Interactive table visualization)
│   │   │   ├── OperatorReference.tsx (TRC/DRC operator cheat sheet)
│   │   │   └── SampleQueries.tsx   (Pre-built example queries)
│   │   ├── learn/
│   │   │   ├── ConceptExplanation.tsx
│   │   │   ├── AnimatedVideo.tsx
│   │   │   └── References.tsx
│   │   ├── practice/
│   │   │   ├── QuizMode.tsx
│   │   │   ├── ChallengeMode.tsx
│   │   │   ├── ExerciseList.tsx
│   │   │   └── ScoreTracker.tsx
│   │   ├── help/
│   │   │   └── HelpContent.tsx
│   │   ├── builder/
│   │   │   └── BuilderModal.tsx    (Developer + Mentor info modal)
│   │   └── ai/
│   │       ├── AiExplainer.tsx     (AI query explainer UI)
│   │       └── ChatInterface.tsx   (AI chat interface)
│   ├── engine/
│   │   ├── tokenizer.ts            (TRC/DRC tokenizer/lexer)
│   │   ├── parser.ts               (TRC/DRC parser)
│   │   ├── ast.ts                  (Abstract Syntax Tree types)
│   │   ├── translator.ts           (TRC/DRC to SQL translator)
│   │   ├── validator.ts            (Query validation)
│   │   ├── evaluator.ts            (Query result evaluator)
│   │   ├── examples.ts             (Built-in example queries)
│   │   └── types.ts                (TypeScript type definitions)
│   ├── hooks/
│   │   ├── useTheme.ts             (Day/Night mode hook)
│   │   ├── useLocalStorage.ts      (Local storage persistence)
│   │   ├── useQueryHistory.ts      (Query history management)
│   │   └── useGroqApi.ts           (Groq API integration hook)
│   ├── utils/
│   │   ├── reportGenerator.ts      (PDF/report generation)
│   │   ├── constants.ts            (App-wide constants)
│   │   └── helpers.ts              (Utility functions)
│   ├── context/
│   │   ├── ThemeContext.tsx         (Theme provider)
│   │   └── AppContext.tsx           (Global app state)
│   └── pages/
│       ├── SimulatorPage.tsx       (Main simulator page)
│       ├── LearnPage.tsx           (Learn section page)
│       ├── PracticePage.tsx        (Practice section page)
│       └── HelpPage.tsx            (Help section page)
└── docs/
    ├── architecture.md             (Architecture documentation)
    ├── api.md                      (API documentation)
    ├── test-cases.md               (Test cases documentation)
    └── screenshots/                (Screenshots for documentation)
```

---

## 13. AI Integration Plan

### Groq API Integration
- **Provider**: Groq (groq.com)
- **Model**: `llama3-70b-8192` or similar available model
- **API Key**: Will be provided by user as environment variable
- **Storage**: Store in `.env` file as `VITE_GROQ_API_KEY`

### AI Features to Implement

#### 13.1 AI Query Explainer
- User inputs a TRC/DRC query
- App sends query to Groq API with prompt:
  ```
  Explain this Tuple Relational Calculus / Domain Relational Calculus query
  in plain English. Break it down step by step. What does each part do?
  What would the result be? Provide explanation at [level] difficulty.
  ```
- Response displayed in a clean, formatted card

#### 13.2 AI Error Corrector
- User inputs an invalid/incorrect query
- App sends to Groq API with prompt:
  ```
  This TRC/DRC query has errors. Identify the errors and suggest corrections.
  Explain what went wrong and why.
  ```
- Response shows errors and corrected version

#### 13.3 AI Concept Q&A
- Chat interface for asking questions about relational calculus
- Context-aware based on current query in the editor
- Maintains conversation history within session

### API Safety
- Never hardcode API keys in source code
- Use environment variables
- Add rate limiting on client side
- Handle API errors gracefully with user-friendly messages

---

## 14. Testing Requirements

### Functional Testing
- Every TRC query translates to correct SQL
- Every DRC query translates to correct SQL
- All UI buttons work as expected
- Navigation between tabs works
- Day/Night mode toggles correctly
- Download generates valid file
- AI features return proper responses
- Error handling shows meaningful messages

### Boundary Testing
- Empty query input → show appropriate message
- Very long query → no UI breakdown
- Special characters in query → handled gracefully
- Invalid syntax → clear error message
- SQL reserved words in query → handled

### Usability Testing
- First-time user can navigate without help
- All text is readable
- All buttons are clearly labeled
- Color contrast meets accessibility standards

### Performance Testing
- Translation of complex queries completes in < 1 second
- UI remains responsive during translation
- No memory leaks with repeated operations

### Error Handling
- Invalid TRC/DRC syntax → show line and position of error
- API failure → show "AI service unavailable" message
- Empty results → show "No tuples match the query"
- Network errors → graceful degradation

---

## 15. Documentation Requirements

### README.md (Must Include)
- Project title and description
- Features list
- Screenshots
- Installation instructions
- Usage guide
- Technology stack
- Contributors
- License

### User Manual (Help Tab)
- What the app does
- How to use each feature
- Step-by-step instructions
- FAQ section

### Architecture Documentation
- System architecture diagram
- Component hierarchy
- Data flow
- Translation algorithm explanation

### Test Cases Documentation
- Test case ID
- Input
- Expected output
- Actual output
- Pass/Fail status

---

## 16. Rules & Constraints

### Absolute Rules (NEVER violate these)
1. **NO EMOJI** anywhere in the UI — use Lucide React icons only
2. **NO** Material UI, Bootstrap, Chakra UI, or other component libraries — Lucide React + Tailwind only
3. **NO** hardcoded API keys in source code
4. **NO** backend server — all logic is client-side
5. **NO** database connection — this is a translator, not a DB engine
6. **ALWAYS** include all mandatory sections (Learn, Builder, Help, Download, Day/Night)
7. **ALWAYS** use TypeScript — no plain JavaScript files
8. **ALWAYS** handle errors gracefully — no unhandled exceptions
9. **ALWAYS** maintain consistent design across all pages
10. **NEVER** commit `.env` files or secrets to git

### Code Quality Rules
- Follow existing code conventions in the project
- Use functional React components with hooks
- Use proper TypeScript types for all props and state
- Keep components small and focused (single responsibility)
- Extract reusable logic into custom hooks
- Keep files under 300 lines — split if larger

### Naming Conventions
- Components: PascalCase (`QueryInput.tsx`)
- Hooks: camelCase with `use` prefix (`useTheme.ts`)
- Utils: camelCase (`reportGenerator.ts`)
- Types/Interfaces: PascalCase (`QueryResult.ts`)
- Constants: UPPER_SNAKE_CASE (`MAX_QUERY_LENGTH`)
- Files: kebab-case for non-component files

---

## 17. Common Pitfalls to Avoid

1. **Skipping the parser/lexer**: Don't use regex for parsing TRC/DRC. Build a proper tokenizer and parser.
2. **Ignoring edge cases**: TRC/DRC have complex nested quantifiers. Handle them properly.
3. **Hardcoding examples**: The translator must work for ANY valid TRC/DRC query, not just pre-built ones.
4. **Poor error messages**: "Invalid query" is not helpful. "Unexpected token '∧' at position 15: expected a relation name" is helpful.
5. **Blocking UI during translation**: Use async operations so the UI stays responsive.
6. **Forgetting localStorage**: Query history and preferences should persist across sessions.
7. **Overcomplicating the AI integration**: Keep AI prompts focused and specific.
8. **Ignoring the dark mode**: Test both themes thoroughly.
9. **Skipping the Help section**: It's mandatory and must be comprehensive.
10. **Not generating the PDF report**: The Download feature is mandatory.

---

## 18. Checklist for Every Agent Session

Before starting any work in a new session, verify:

- [ ] Read this AGENTS.md file completely
- [ ] Understand the project is a TRC/DRC to SQL translator
- [ ] Know the tech stack: React + TypeScript + Vite + Tailwind + Lucide React
- [ ] Know the mandatory sections: Learn, Simulator, Practice, Builder, Help, Download, Day/Night
- [ ] Know the developer info: Kevin Daniel, 25BCE1823, lrkevindaniel@gmail.com
- [ ] Know the mentor info: Dr. Swaminathan A, Assistant Professor
- [ ] Understand NO emoji, NO extra UI libraries
- [ ] Check current git status before making changes
- [ ] Run `npm run dev` to verify the app starts
- [ ] Run `npm run lint` and `npm run typecheck` (or `tsc --noEmit`) before committing
- [ ] Test in both light and dark modes
- [ ] Verify no secrets are committed

---

## Appendix A: TRC/DRC Syntax Reference

### TRC Syntax
```
{ TupleVariable | Condition }
{ TupleVariable.Attribute | Condition }
```

### DRC Syntax
```
{ <DomainVariable1, DomainVariable2, ...> | Condition }
```

### Operators
| Symbol | Name | SQL Equivalent |
|--------|------|----------------|
| ∧ | Conjunction | AND |
| ∨ | Disjunction | OR |
| ¬ | Negation | NOT |
| → | Implication | NOT ... OR |
| ↔ | Biconditional | = or IS NOT DISTINCT FROM |
| ∀ | Universal quantifier | NOT EXISTS ... NOT |
| ∃ | Existential quantifier | EXISTS |
| ∈ | Membership | IN / FROM |
| = | Equality | = |
| ≠ | Inequality | != or <> |
| < | Less than | < |
| > | Greater than | > |
| ≤ | Less or equal | <= |
| ≥ | Greater or equal | >= |

### Example TRC to SQL Mappings

**Example 1**:
- TRC: `{T | T ∈ Student ∧ T.age > 20}`
- SQL: `SELECT * FROM Student WHERE age > 20`

**Example 2**:
- TRC: `{T.name | T ∈ Student ∧ T.dept = 'CS'}`
- SQL: `SELECT name FROM Student WHERE dept = 'CS'`

**Example 3**:
- TRC: `{T.name | ∃S(T.name = S.name ∧ S.course = 'DBMS')}`
- SQL: `SELECT name FROM Student WHERE EXISTS (SELECT * FROM Enrollment WHERE Student.name = Enrollment.name AND course = 'DBMS')`

**Example 4**:
- TRC: `{T.name | ∀C(T.name = C.student → C.grade = 'A')}`
- SQL: `SELECT name FROM Student WHERE NOT EXISTS (SELECT * FROM Enrollment WHERE Student.name = Enrollment.student AND grade != 'A')`

---

## Appendix B: Keyboard Shortcuts (To Implement)

| Shortcut | Action |
|----------|--------|
| Ctrl + Enter | Execute/translate query |
| Ctrl + Shift + F | Format query |
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + K | Open command palette |
| Ctrl + S | Download/export report |
| Ctrl + L | Clear input |
| Ctrl + D | Toggle Day/Night mode |
| Ctrl + 1 | Switch to Simulator tab |
| Ctrl + 2 | Switch to Learn tab |
| Ctrl + 3 | Switch to Practice tab |
| Ctrl + 4 | Switch to Help tab |

---

## Appendix C: Sample Queries for Testing

### Basic TRC Queries
```trc
{T | T ∈ Students ∧ T.age > 20}
{T.name | T ∈ Students}
{T | T ∈ Students ∧ T.dept = 'CS' ∧ T.gpa >= 3.5}
```

### Intermediate TRC Queries
```trc
{T.name | ∃E(T.name = E.student ∧ E.course = 'DBMS')}
{T.name | ∀E(T.name = E.student → E.grade = 'A')}
{T | ∃S(T.dept = S.dept ∧ S.name = 'Alice')}
```

### Advanced TRC Queries
```trc
{T.name | ∀C(∃E(T.name = E.student ∧ E.course = C.name) → C.credits >= 3)}
{T | ¬∃S(S.dept = T.dept ∧ S.gpa > T.gpa)}
```

### Basic DRC Queries
```drc
{<name, age> | <name, age, dept> ∈ Students ∧ dept = 'CS'}
{<s> | ∃c(<s, c> ∈ Enrolls ∧ c = 'DBMS')}
```

### DRC Queries with Multiple Quantifiers
```drc
{<s> | ∀c(<s, c> ∈ Enrolls → c ∈ RequiredCourses)}
{<s, g> | ∃c(<s, c, g> ∈ Grades ∧ g = 'A')}
```

---

*Last updated: 2026-09-16*
*This file must be updated whenever project structure, requirements, or conventions change.*
