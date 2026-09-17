# Architecture

## System Overview

The TRC/DRC Translator is a client-side React application that parses relational calculus queries and translates them to SQL.

## Component Hierarchy

```
App
├── ThemeProvider (context)
├── AppProvider (context)
├── Layout
│   ├── Navbar
│   │   ├── Navigation Tabs
│   │   ├── Download Menu (Text/PDF)
│   │   ├── Builder Button
│   │   └── Theme Toggle
│   ├── Pages
│   │   ├── SimulatorPage
│   │   │   ├── QueryInput (with CodeEditor)
│   │   │   ├── StepByStep
│   │   │   ├── SyntaxChecker
│   │   │   ├── AiErrorCorrector
│   │   │   ├── AiExplainer
│   │   │   ├── PredicateTree
│   │   │   ├── EquivalenceChecker
│   │   │   ├── AiQueryGenerator
│   │   │   ├── RelationViewer
│   │   │   ├── SampleQueries
│   │   │   ├── OperatorReference
│   │   │   └── QueryHistory
│   │   ├── LearnPage
│   │   │   ├── ConceptExplanation
│   │   │   ├── AnimatedVideo
│   │   │   └── References
│   │   ├── PracticePage
│   │   │   ├── QuizMode (100 MCQs)
│   │   │   ├── ChallengeMode
│   │   │   ├── ExerciseList
│   │   │   ├── ScoreTracker
│   │   │   └── SpacedRepetition
│   │   └── HelpPage
│   │       └── HelpContent
│   └── Footer
├── BuilderModal
└── CommandPalette
```

## Data Flow

1. **User Input** → CodeEditor (with syntax highlighting)
2. **Tokenizer** → Tokenizes input into tokens
3. **Parser** → Builds AST from tokens
4. **Translator** → Generates SQL from AST with steps
5. **Evaluator** → Evaluates query against sample database
6. **UI** → Displays results, steps, and visualizations

## Translation Algorithm

1. Tokenize input using custom lexer (supports Unicode + text operators)
2. Parse tokens into Abstract Syntax Tree (AST)
3. Detect calculus type (TRC vs DRC) from syntax
4. For TRC: Find main relation, extract projections, build WHERE clause
5. For DRC: Find main relation, extract domain variables
6. Handle quantifiers (EXISTS/FORALL) as subqueries
7. Record each step for visualization
8. Output final SQL with semicolon
