import { SampleQuery, PracticeExercise } from './types';

export const sampleQueries: SampleQuery[] = [
  {
    id: 'trc-basic-1',
    calculusType: 'TRC',
    query: "{T | T in Students AND T.age > 20}",
    description: 'Select all students older than 20',
    difficulty: 'basic',
    expectedSql: "SELECT * FROM Students WHERE age > 20;",
  },
  {
    id: 'trc-basic-2',
    calculusType: 'TRC',
    query: "{T.name | T in Students}",
    description: 'Select all student names',
    difficulty: 'basic',
    expectedSql: "SELECT T.name FROM Students;",
  },
  {
    id: 'trc-basic-3',
    calculusType: 'TRC',
    query: "{T | T in Students AND T.dept = 'CS' AND T.gpa >= 3.5}",
    description: 'Select CS students with GPA >= 3.5',
    difficulty: 'basic',
    expectedSql: "SELECT * FROM Students WHERE dept = 'CS' AND gpa >= 3.5;",
  },
  {
    id: 'trc-inter-1',
    calculusType: 'TRC',
    query: "{T.name | T in Students AND exists E(E in Enrollment AND T.name = E.student AND E.course = 'DBMS')}",
    description: 'Find students enrolled in DBMS course',
    difficulty: 'intermediate',
    expectedSql: "SELECT name FROM Students WHERE EXISTS (SELECT * FROM Enrollment WHERE Students.name = Enrollment.student AND course = 'DBMS');",
  },
  {
    id: 'trc-inter-2',
    calculusType: 'TRC',
    query: "{T.name | T in Students AND forall E(E in Enrollment AND T.name = E.student implies E.grade = 'A')}",
    description: 'Find students who got all A grades',
    difficulty: 'intermediate',
    expectedSql: "SELECT name FROM Students WHERE NOT EXISTS (SELECT * FROM Enrollment WHERE Students.name = Enrollment.student AND grade != 'A');",
  },
  {
    id: 'trc-adv-1',
    calculusType: 'TRC',
    query: "{T | T in Students AND not exists S(S in Students AND S.dept = T.dept AND S.gpa > T.gpa)}",
    description: 'Find students with highest GPA in their department',
    difficulty: 'advanced',
    expectedSql: "SELECT * FROM Students WHERE NOT EXISTS (SELECT * FROM Students S WHERE S.dept = Students.dept AND S.gpa > Students.gpa);",
  },
  {
    id: 'drc-basic-1',
    calculusType: 'DRC',
    query: "{<name, age> | <name, age, dept> in Students AND dept = 'CS'}",
    description: 'Select name and age of CS students',
    difficulty: 'basic',
    expectedSql: "SELECT name, age FROM Students WHERE dept = 'CS';",
  },
  {
    id: 'drc-basic-2',
    calculusType: 'DRC',
    query: "{<s> | exists c(<s, c> in Enrolls AND c = 'DBMS')}",
    description: 'Find students enrolled in DBMS',
    difficulty: 'basic',
    expectedSql: "SELECT s FROM Enrolls WHERE c = 'DBMS';",
  },
  {
    id: 'drc-inter-1',
    calculusType: 'DRC',
    query: "{<s> | forall c(<s, c> in Enrolls implies c in RequiredCourses)}",
    description: 'Find students who only take required courses',
    difficulty: 'intermediate',
    expectedSql: "SELECT s FROM Enrolls WHERE NOT EXISTS (SELECT * FROM Enrolls E WHERE E.s = Enrolls.s AND NOT EXISTS (SELECT * FROM RequiredCourses R WHERE R.course = E.c));",
  },
];

export const practiceExercises: PracticeExercise[] = [
  {
    id: 'ex-1',
    calculusType: 'TRC',
    question: "What does this TRC query return?\n{T | T in Students AND T.age > 20}",
    options: [
      'All students older than 20',
      'All students named T',
      'Students with age less than 20',
      'All student names',
    ],
    correctIndex: 0,
    explanation:
      "The query selects all tuples T from the Students relation where the age attribute is greater than 20.",
    difficulty: 'basic',
  },
  {
    id: 'ex-2',
    calculusType: 'TRC',
    question: "Translate to SQL: {T.name | T in Students AND T.dept = 'CS'}",
    options: [
      "SELECT * FROM Students WHERE dept = 'CS'",
      "SELECT T.name FROM Students WHERE dept = 'CS'",
      "SELECT name FROM Students",
      "SELECT dept FROM Students WHERE name = 'CS'",
    ],
    correctIndex: 1,
    explanation:
      "T.name indicates we only project the name attribute. The WHERE clause filters for CS department.",
    difficulty: 'basic',
  },
  {
    id: 'ex-3',
    calculusType: 'TRC',
    question: "What does 'exists' mean in TRC?",
    options: [
      'For all tuples',
      'There exists at least one',
      'For none',
      'Exactly one',
    ],
    correctIndex: 1,
    explanation:
      "'exists' is the existential quantifier, meaning 'there exists at least one tuple satisfying the condition'.",
    difficulty: 'basic',
  },
  {
    id: 'ex-4',
    calculusType: 'TRC',
    question:
      "How is 'forall T(P(T))' translated to SQL?",
    options: [
      'SELECT * FROM R WHERE P',
      'EXISTS (SELECT * FROM R WHERE P)',
      'NOT EXISTS (SELECT * FROM R WHERE NOT P)',
      'SELECT DISTINCT * FROM R',
    ],
    correctIndex: 2,
    explanation:
      "Universal quantification forall is translated using NOT EXISTS with a negated condition, since 'for all T, P(T)' is equivalent to 'there is no T where NOT P(T)'.",
    difficulty: 'intermediate',
  },
  {
    id: 'ex-5',
    calculusType: 'DRC',
    question: "What does {<x, y> | <x, y, z> in R AND z > 10} return?",
    options: [
      'All tuples from R',
      'All x, y pairs where z > 10',
      'All z values greater than 10',
      'The count of tuples with z > 10',
    ],
    correctIndex: 1,
    explanation:
      "DRC selects specific domain variables (x, y) where the condition on z is satisfied.",
    difficulty: 'basic',
  },
  {
    id: 'ex-6',
    calculusType: 'TRC',
    question: "What is the SQL equivalent of 'implies' in TRC?",
    options: [
      'AND',
      'OR',
      'NOT ... OR',
      'EXISTS',
    ],
    correctIndex: 2,
    explanation:
      "P implies Q is logically equivalent to NOT P OR Q, which translates to NOT P OR Q in SQL.",
    difficulty: 'intermediate',
  },
];
