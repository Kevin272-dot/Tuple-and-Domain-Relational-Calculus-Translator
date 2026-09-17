export interface MCQQuestion {
  id: string;
  calculusType: 'TRC' | 'DRC' | 'General';
  difficulty: 'basic' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  topic: string;
}

export const mcqBank: MCQQuestion[] = [
  // ============================================================
  // TRC QUESTIONS (40)
  // ============================================================

  // --- Basic TRC (15) ---
  {
    id: 'trc-b-001',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What does the TRC expression {T | T in Students} return?',
    options: [
      'All tuples in the Students relation',
      'All attribute names of Students',
      'The count of tuples in Students',
      'Only the first tuple in Students'
    ],
    correctIndex: 0,
    explanation: 'The expression {T | T in Students} with no additional conditions selects every tuple in the Students relation, equivalent to SELECT * FROM Students.',
    topic: 'selection'
  },
  {
    id: 'trc-b-002',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'Which SQL query is equivalent to {T.name | T in Students}?',
    options: [
      'SELECT * FROM Students',
      'SELECT name FROM Students',
      'SELECT DISTINCT name FROM Students',
      'SELECT T.name FROM Students AS T'
    ],
    correctIndex: 1,
    explanation: 'The projection T.name means we only retrieve the name attribute. This maps directly to SELECT name FROM Students.',
    topic: 'projection'
  },
  {
    id: 'trc-b-003',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'In TRC, what does the symbol "and" (logical conjunction) map to in SQL?',
    options: [
      'OR',
      'AND',
      'NOT',
      'IN'
    ],
    correctIndex: 1,
    explanation: 'The conjunction operator "and" (∧) in TRC maps directly to the AND keyword in SQL WHERE clauses.',
    topic: 'operator mapping'
  },
  {
    id: 'trc-b-004',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What is a tuple variable in TRC?',
    options: [
      'A variable that ranges over column values',
      'A variable that ranges over entire rows (tuples) of a relation',
      'A constant value in a query',
      'A SQL keyword for aliases'
    ],
    correctIndex: 1,
    explanation: 'In TRC, tuple variables range over tuples (rows) of relations. Each tuple variable represents an entire row, unlike DRC where variables range over domain values.',
    topic: 'tuple variables'
  },
  {
    id: 'trc-b-005',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'Which TRC expression selects students older than 20?',
    options: [
      '{T | T.age > 20}',
      '{T.age > 20 | T in Students}',
      '{T | T > 20}',
      '{T.in Students | T.age > 20}'
    ],
    correctIndex: 0,
    explanation: 'The correct TRC syntax is {T | condition}, where T is a tuple variable and the condition filters tuples. T.age > 20 is the filtering condition.',
    topic: 'syntax rules'
  },
  {
    id: 'trc-b-006',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What does the existential quantifier "exists" mean in TRC?',
    options: [
      'For all tuples, the condition holds',
      'There is at least one tuple satisfying the condition',
      'No tuples satisfy the condition',
      'Exactly one tuple satisfies the condition'
    ],
    correctIndex: 1,
    explanation: 'The existential quantifier "exists" (∃) asserts that there is at least one tuple in the specified relation that makes the condition true.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-b-007',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What is the SQL equivalent of {T | T in Students and T.dept = "CS"}?',
    options: [
      'SELECT * FROM Students WHERE dept = "CS"',
      'SELECT dept FROM Students WHERE dept = "CS"',
      'SELECT * FROM Students OR dept = "CS"',
      'SELECT * FROM Students HAVING dept = "CS"'
    ],
    correctIndex: 0,
    explanation: 'The condition T.dept = "CS" filters tuples, and the full tuple T is projected, resulting in SELECT * FROM Students WHERE dept = "CS".',
    topic: 'selection'
  },
  {
    id: 'trc-b-008',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'In TRC, the vertical bar "|" separates:',
    options: [
      'Two relations',
      'The result tuple pattern from the condition',
      'The SELECT clause from the FROM clause',
      'Two conditions'
    ],
    correctIndex: 1,
    explanation: 'In TRC syntax {tuple_pattern | condition}, the vertical bar separates the tuple pattern (what to return) from the condition (filtering criteria).',
    topic: 'syntax rules'
  },
  {
    id: 'trc-b-009',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'Which TRC expression retrieves only the name and age of students in the CS department?',
    options: [
      '{T | T in Students and T.dept = "CS"}',
      '{T.name, T.age | T in Students and T.dept = "CS"}',
      '{name, age | T in Students and T.dept = "CS"}',
      '{T.name and T.age | T.dept = "CS"}'
    ],
    correctIndex: 1,
    explanation: 'To project specific attributes, list them in the tuple pattern: {T.name, T.age | condition}. This corresponds to SELECT name, age FROM Students WHERE dept = "CS".',
    topic: 'projection'
  },
  {
    id: 'trc-b-010',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What does the "not" operator do in TRC?',
    options: [
      'Reverses the result of a boolean condition',
      'Deletes tuples from the result',
      'Negates a relation name',
      'Converts TRC to DRC'
    ],
    correctIndex: 0,
    explanation: 'The "not" operator (¬) is a logical negation that reverses the truth value of a boolean condition, just like NOT in SQL.',
    topic: 'operator mapping'
  },
  {
    id: 'trc-b-011',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'Which TRC expression is equivalent to SELECT * FROM Students WHERE gpa >= 3.0 AND dept = "CS"?',
    options: [
      '{T | T in Students or T.gpa >= 3.0 or T.dept = "CS"}',
      '{T | T in Students and T.gpa >= 3.0 and T.dept = "CS"}',
      '{T | T.gpa >= 3.0 and T.dept = "CS"}',
      'Both B and C'
    ],
    correctIndex: 3,
    explanation: 'Both {T | T in Students and T.gpa >= 3.0 and T.dept = "CS"} and {T | T.gpa >= 3.0 and T.dept = "CS"} are valid, as the "in Students" part is implicit when attributes reference that relation.',
    topic: 'selection'
  },
  {
    id: 'trc-b-012',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What is the result of {T | T in Students and T.age > 100} when no student is older than 100?',
    options: [
      'An error',
      'An empty relation',
      'The entire Students relation',
      'NULL'
    ],
    correctIndex: 1,
    explanation: 'When no tuples satisfy the condition, the TRC expression returns an empty relation (no rows), similar to a SQL query with a WHERE clause matching nothing.',
    topic: 'selection'
  },
  {
    id: 'trc-b-013',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'In TRC, "or" (∨) maps to which SQL operator?',
    options: [
      'AND',
      'OR',
      'XOR',
      'NOR'
    ],
    correctIndex: 1,
    explanation: 'The disjunction operator "or" (∨) in TRC maps directly to the OR keyword in SQL.',
    topic: 'operator mapping'
  },
  {
    id: 'trc-b-014',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'Which of the following is a valid TRC tuple variable declaration?',
    options: [
      'T = Students',
      'T in Students',
      'T -> Students',
      'T : Students'
    ],
    correctIndex: 1,
    explanation: 'In TRC, tuple variables are declared using "in" to indicate they range over a relation: T in Students means T ranges over tuples in the Students relation.',
    topic: 'tuple variables'
  },
  {
    id: 'trc-b-015',
    calculusType: 'TRC',
    difficulty: 'basic',
    question: 'What does {T.name | T in Students} return if Students has columns {name, age, dept}?',
    options: [
      'All columns of all students',
      'A relation with a single column "name" containing all student names',
      'A list of tuples with name as a tuple',
      'Only the first name value'
    ],
    correctIndex: 1,
    explanation: 'The projection T.name extracts only the name attribute from each tuple, producing a single-column relation with all student names.',
    topic: 'projection'
  },

  // --- Intermediate TRC (13) ---
  {
    id: 'trc-i-001',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Translate to SQL: {T.name | exists E(T.name = E.student and E.course = "DBMS")}',
    options: [
      'SELECT name FROM Students WHERE name IN (SELECT student FROM Enrolls WHERE course = "DBMS")',
      'SELECT name FROM Students, Enrolls WHERE name = student AND course = "DBMS"',
      'SELECT DISTINCT S.name FROM Students S JOIN Enrolls E ON S.name = E.student WHERE E.course = "DBMS"',
      'All of the above are equivalent'
    ],
    correctIndex: 3,
    explanation: 'The existential quantifier with a join condition translates to various SQL forms including subquery with IN, implicit join, and explicit JOIN. All express the same result: students enrolled in DBMS.',
    topic: 'joins'
  },
  {
    id: 'trc-i-002',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'What does the universal quantifier "forall" mean in TRC?',
    options: [
      'At least one tuple satisfies the condition',
      'All tuples in the specified relation satisfy the condition',
      'No tuples satisfy the condition',
      'Exactly half the tuples satisfy the condition'
    ],
    correctIndex: 1,
    explanation: 'The universal quantifier "forall" (∀) asserts that every tuple in the specified relation makes the condition true. In SQL, this is typically expressed using NOT EXISTS with a negated condition.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-i-003',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'What is wrong with this TRC query: {T.name | T in Students and exists S(S in Students and S.age > T.age)}?',
    options: [
      'Nothing, it is valid',
      'Missing the "in" keyword before Students in the outer scope',
      'The inner "exists" quantifier cannot reference T',
      'S cannot be declared inside an exists clause'
    ],
    correctIndex: 0,
    explanation: 'This query is valid TRC. It selects names of students who are not the oldest (there exists another student older than them). The inner quantifier can reference T from the outer scope.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-i-004',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Translate: {T.name | forall C(T.name = C.student implies C.grade = "A")}',
    options: [
      'SELECT name FROM Students WHERE grade = "A"',
      'SELECT name FROM Students WHERE NOT EXISTS (SELECT * FROM Courses C WHERE NOT (name = C.student OR C.grade = "A"))',
      'SELECT name FROM Students WHERE grade = "A" AND EXISTS (SELECT * FROM Courses)',
      'SELECT name FROM Students WHERE ALL grades are "A"'
    ],
    correctIndex: 1,
    explanation: 'The universal quantifier with implication translates to NOT EXISTS with the negated consequent. "forall X: P implies Q" becomes "NOT EXISTS X: P AND NOT Q".',
    topic: 'implications'
  },
  {
    id: 'trc-i-005',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'In TRC, what does "T.name = S.name and T.dept = S.dept" with two tuple variables mean?',
    options: [
      'It compares attributes from the same tuple',
      'It compares attributes from two potentially different tuples',
      'It is a syntax error',
      'It creates a cross product'
    ],
    correctIndex: 1,
    explanation: 'When two different tuple variables T and S are used, the condition compares attributes from different tuples. This is used in self-joins and existential/universal quantifications.',
    topic: 'tuple variables'
  },
  {
    id: 'trc-i-006',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Which TRC expression finds students who take ALL courses offered by the CS department?',
    options: [
      '{T | forall C(C.dept = "CS" implies exists E(E.student = T.name and E.course = C.name))}',
      '{T | exists C(C.dept = "CS" and exists E(E.student = T.name and E.course = C.name))}',
      '{T | forall C(C.dept = "CS" and exists E(E.student = T.name))}',
      '{T | exists C(C.dept = "CS" implies forall E(E.student = T.name))}'
    ],
    correctIndex: 0,
    explanation: 'Universal quantification over CS courses with an implication that each course must be found in the enrollment of the student. This is the classic "takes all" pattern requiring forall + implies + exists.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-i-007',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'What is the SQL equivalent of {T | not exists S(S in Students and S.dept = T.dept and S.gpa > T.gpa)}?',
    options: [
      'Students with the highest GPA in their department',
      'Students who have no department',
      'Students with GPA higher than at least one other student',
      'Students who share a department with someone'
    ],
    correctIndex: 0,
    explanation: 'The negated existential means "there is no other student in the same department with a higher GPA," which identifies students with the maximum GPA in their department.',
    topic: 'negation'
  },
  {
    id: 'trc-i-008',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Which of these is a correct mapping of "implies" (→) to SQL?',
    options: [
      'A → B becomes A AND B',
      'A → B becomes NOT A OR B',
      'A → B becomes A OR NOT B',
      'A → B becomes NOT A AND B'
    ],
    correctIndex: 1,
    explanation: 'Material implication A → B is logically equivalent to NOT A OR B. This is a fundamental equivalence used when translating TRC implications to SQL.',
    topic: 'implications'
  },
  {
    id: 'trc-i-009',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Translate: {T | T in Students and T.age > (SELECT MAX(age) FROM Students)} -- what is this conceptually?',
    options: [
      'All students',
      'Students older than every other student',
      'Students older than the average age',
      'This is not valid TRC'
    ],
    correctIndex: 3,
    explanation: 'TRC does not have a SELECT MAX subquery syntax. The correct way to express "oldest student" in TRC is: {T | forall S(S in Students implies T.age >= S.age)}.',
    topic: 'syntax rules'
  },
  {
    id: 'trc-i-010',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'What does {T.name | T in Students and not exists E(E.student = T.name and E.course = "DBMS")} return?',
    options: [
      'Students who take DBMS',
      'Students who do not take DBMS',
      'All course names except DBMS',
      'Students who take only DBMS'
    ],
    correctIndex: 1,
    explanation: 'The negated existential "not exists" means there is no enrollment record for this student in DBMS, so it returns students who have NOT enrolled in the DBMS course.',
    topic: 'negation'
  },
  {
    id: 'trc-i-011',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'In TRC, can a tuple variable reference attributes from a relation that is not in its "in" clause?',
    options: [
      'Yes, if the relation has compatible attributes',
      'No, a tuple variable can only access attributes of the relation it ranges over',
      'Yes, but only inside an exists clause',
      'Only if the attribute names are unique across all relations'
    ],
    correctIndex: 1,
    explanation: 'A tuple variable in TRC is bound to a specific relation via the "in" clause and can only reference attributes of that relation.',
    topic: 'tuple variables'
  },
  {
    id: 'trc-i-012',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'What does {T.name | T in Students and forall C(C in Courses implies exists E(E.student = T.name and E.course = C.name))} express?',
    options: [
      'Students who take at least one course',
      'Students who take every course',
      'Courses taken by all students',
      'Students who take no courses'
    ],
    correctIndex: 1,
    explanation: 'For every course C, there must exist an enrollment E linking this student to that course. This means the student is enrolled in every course in the Courses relation.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-i-013',
    calculusType: 'TRC',
    difficulty: 'intermediate',
    question: 'Which SQL query does NOT correspond to any valid TRC expression?',
    options: [
      'SELECT * FROM Students WHERE age > 20',
      'SELECT * FROM Students WHERE EXISTS (SELECT * FROM Enrolls)',
      'SELECT TOP 1 * FROM Students ORDER BY age',
      'SELECT name FROM Students WHERE dept = "CS"'
    ],
    correctIndex: 2,
    explanation: 'TRC and relational algebra do not have a concept of "top N" or ORDER BY. TRC is based on set semantics, not ordered results. SQL-specific constructs like TOP and ORDER BY have no TRC equivalent.',
    topic: 'SQL equivalents'
  },

  // --- Advanced TRC (12) ---
  {
    id: 'trc-a-001',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Translate: {T.name | forall S(T.name != S.name implies exists E(E.student = S.name and not exists F(F.student = T.name and F.course = E.course)))}',
    options: [
      'Students who take at least one course no other student takes',
      'Students who share a course with someone',
      'Students who take all courses that some other student takes',
      'Students who do not share any course with any other student'
    ],
    correctIndex: 0,
    explanation: 'For every other student S, if S takes some course, there must be a course that T does not take. Equivalently, there is some course that only T takes (no other student takes it).',
    topic: 'quantifiers'
  },
  {
    id: 'trc-a-002',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'What is wrong with: {T | forall S(S in Students implies T.age > S.age)}?',
    options: [
      'Nothing, this returns students strictly older than all others',
      'This would also exclude the student from comparing with themselves',
      'Syntax error: cannot use forall with implies',
      'The condition should use exists instead of forall'
    ],
    correctIndex: 1,
    explanation: 'The query returns students older than ALL students including themselves, which is impossible (no one is strictly older than themselves). To find the oldest student, you need: {T | forall S(S in Students implies T.age >= S.age)} (with >=).',
    topic: 'common mistakes'
  },
  {
    id: 'trc-a-003',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Translate: {T.name | forall C(C in Courses implies (exists E1(E1.student = T.name and E1.course = C.name) implies exists E2(E2.student = T.name and E2.course = C.name and E2.grade = "A")))}',
    options: [
      'Students who take every course and get an A in all of them',
      'Students who get an A in every course they take',
      'Students who take at least one course with an A',
      'Students who get an A only in courses they take'
    ],
    correctIndex: 1,
    explanation: 'For every course, if the student takes it, then they get an A in it. This is the "for all courses taken, grade is A" pattern. Students who take no courses also satisfy this vacuously.',
    topic: 'implications'
  },
  {
    id: 'trc-a-004',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'What is the SQL equivalent of {T.name | not exists S(S in Students and T.name = S.name and exists E(E.student = S.name and not exists F(F.student = T.name and F.course = E.course)))}?',
    options: [
      'Students who take all courses that other students take',
      'Students who do not take any course that another student takes',
      'Students who take at least one course another student takes',
      'Students who take a superset of courses compared to every other student'
    ],
    correctIndex: 3,
    explanation: 'The double negation pattern expresses: for every other student, every course that student takes is also taken by T. This means T takes a superset of courses compared to every other student.',
    topic: 'negation'
  },
  {
    id: 'trc-a-005',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Can the TRC expression {T.name | T in Students and T.age > 20 and T.age < 18} return any results?',
    options: [
      'Yes, if there are students between 18 and 20',
      'No, because the conditions are contradictory',
      'Yes, all students would be returned',
      'It depends on the database instance'
    ],
    correctIndex: 1,
    explanation: 'No student can simultaneously have age > 20 and age < 18. These are contradictory conditions, so the result is always an empty relation regardless of the database contents.',
    topic: 'common mistakes'
  },
  {
    id: 'trc-a-006',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Translate: {T | exists S(S in Students and T.name = S.name and forall E(E.student = T.name implies E.grade = "A"))}',
    options: [
      'Students who get at least one A',
      'Students whose all grades are A',
      'Students who share a name with someone who has all A grades',
      'Students who have at least one grade that is not A'
    ],
    correctIndex: 1,
    explanation: 'The exists S with T.name = S.name is essentially saying "T is a student." Combined with forall E, if T takes a course, the grade must be A. This means all of T\'s grades are A.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-a-007',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'What is wrong with using "or" instead of "implies" in: {T | forall S(S in Students implies T.dept = S.dept)}?',
    options: [
      'Nothing, both express the same thing',
      'Using "or" would give: forall S(S in Students or T.dept = S.dept), which is always true',
      'Using "or" would give: forall S(S in Students and T.dept = S.dept), which is too restrictive',
      'Using "or" is a syntax error'
    ],
    correctIndex: 1,
    explanation: 'If you replace "implies" with "or", you get forall S(S in Students or T.dept = S.dept). Since S in Students is always true (by definition of the quantifier), this condition is trivially satisfied by all tuples, returning the entire relation.',
    topic: 'common mistakes'
  },
  {
    id: 'trc-a-008',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Translate to SQL: {T.name | T in Students and not forall C(C in Courses implies exists E(E.student = T.name and E.course = C.name))}',
    options: [
      'Students who take all courses',
      'Students who do NOT take all courses (take at least one course, but not every course)',
      'Students who take no courses',
      'Students who take exactly one course'
    ],
    correctIndex: 1,
    explanation: 'NOT forall (condition) is equivalent to exists (not condition). So this means there exists at least one course the student does NOT take, meaning they don\'t take every course.',
    topic: 'negation'
  },
  {
    id: 'trc-a-009',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Which TRC expression is logically equivalent to {T.name | forall S(T.name = S.name or not exists E(E.student = S.name))}?',
    options: [
      'Students who take at least one course',
      'Students who are the only student',
      'All students (regardless of enrollment)',
      'Students who share a name with at least one other student'
    ],
    correctIndex: 2,
    explanation: 'For every student S, either T and S have the same name, or S takes no courses. If there exists any student with courses who has a different name from T, the condition fails. But in practice, this covers all students because T itself satisfies T.name = S.name.',
    topic: 'quantifiers'
  },
  {
    id: 'trc-a-010',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Can TRC express "the student with the second-highest GPA"?',
    options: [
      'Yes, using nested forall quantifiers',
      'Yes, using exists and not exists with a counting condition',
      'No, TRC cannot express this because it lacks counting capabilities',
      'Yes, but only if there are no ties'
    ],
    correctIndex: 2,
    explanation: 'TRC is based on first-order logic and cannot express counting ("at least k" or "exactly k" for arbitrary k). "Second-highest" requires counting distinct GPA values, which is beyond first-order expressibility.',
    topic: 'syntax rules'
  },
  {
    id: 'trc-a-011',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'What does {T | T in Students and exists S(S in Students and S.name = "Alice" and T.dept = S.dept and T.name != "Alice")} return?',
    options: [
      'Alice and all students in her department',
      'All students in Alice\'s department except Alice',
      'All students named Alice',
      'All students not in Alice\'s department'
    ],
    correctIndex: 1,
    explanation: 'The query finds students who are in the same department as Alice but are not Alice themselves. This is a classic "other students in same group" pattern.',
    topic: 'joins'
  },
  {
    id: 'trc-a-012',
    calculusType: 'TRC',
    difficulty: 'advanced',
    question: 'Is there a difference between {T | T in Students and T.age > 20} and {T | T.age > 20}?',
    options: [
      'Yes, the first only checks students, the second checks all tuples',
      'Yes, the first is faster',
      'No, they are semantically equivalent assuming T implicitly ranges over Students',
      'No, the second is invalid syntax'
    ],
    correctIndex: 2,
    explanation: 'In standard TRC, {T | T.age > 20} implicitly assumes T ranges over some relation (usually the only one in context). Both expressions are semantically equivalent when T ranges over Students.',
    topic: 'syntax rules'
  },

  // ============================================================
  // DRC QUESTIONS (35)
  // ============================================================

  // --- Basic DRC (12) ---
  {
    id: 'drc-b-001',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'In DRC, variables range over:',
    options: [
      'Tuples (rows) of relations',
      'Domain values (individual column values)',
      'Entire relations (tables)',
      'Database schemas'
    ],
    correctIndex: 1,
    explanation: 'In Domain Relational Calculus, variables range over domain values (individual column values), unlike TRC where variables range over tuples (rows).',
    topic: 'DRC domain variables'
  },
  {
    id: 'drc-b-002',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'What is the DRC syntax for selecting all name-age pairs from Students?',
    options: [
      '{T | T in Students}',
      '{<n, a> | <n, a, d> in Students}',
      '{n, a | n in Students.name}',
      '{<n> | n in Students}'
    ],
    correctIndex: 1,
    explanation: 'DRC uses angle brackets to list domain variables: {<n, a> | <n, a, d> in Students} where n, a, d are domain variables matching the attributes of Students (name, age, dept).',
    topic: 'syntax rules'
  },
  {
    id: 'drc-b-003',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'Which DRC expression retrieves only the names of students in the CS department?',
    options: [
      '{<n> | <n, d> in Students and d = "CS"}',
      '{<n, d> | <n, d> in Students and d = "CS"}',
      '{n | n in Students and n.dept = "CS"}',
      '{<n> | n in Students.name and dept = "CS"}'
    ],
    correctIndex: 0,
    explanation: 'In DRC, the result tuple <n> is listed before the bar, and the condition uses domain variables. We include d = "CS" in the condition but only project <n>.',
    topic: 'DRC domain variables'
  },
  {
    id: 'drc-b-004',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'What does the DRC expression {<n, a> | <n, a, d> in Students} return?',
    options: [
      'All attributes of all students',
      'Name and age of all students',
      'Only names of students',
      'Only ages of students'
    ],
    correctIndex: 1,
    explanation: 'The result list <n, a> specifies two domain variables to return, so the result contains name and age columns for all students.',
    topic: 'projection'
  },
  {
    id: 'drc-b-005',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'In DRC, what does "exists" quantify over?',
    options: [
      'Domain variables',
      'Tuple variables',
      'Relations',
      'Attributes'
    ],
    correctIndex: 0,
    explanation: 'In DRC, the existential quantifier "exists" quantifies over domain variables (individual values), not tuples. For example, exists x means "there exists some domain value x."',
    topic: 'quantifiers'
  },
  {
    id: 'drc-b-006',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'Which DRC expression finds students older than 20?',
    options: [
      '{<n> | <n, a, d> in Students and a > 20}',
      '{<n, a> | a > 20}',
      '{n | n in Students and n.age > 20}',
      '{<n> | exists a(<n, a> in Students and a > 20)}'
    ],
    correctIndex: 0,
    explanation: 'The correct DRC form lists all domain variables matching the relation schema in the condition part, with the filtering condition a > 20 applied to the age variable.',
    topic: 'selection'
  },
  {
    id: 'drc-b-007',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'What is the main difference between TRC and DRC?',
    options: [
      'TRC is more powerful than DRC',
      'TRC uses tuple variables while DRC uses domain variables',
      'DRC cannot express joins',
      'TRC cannot use quantifiers'
    ],
    correctIndex: 1,
    explanation: 'The fundamental difference is that TRC variables range over tuples (rows), while DRC variables range over domains (individual column values). Both are equally expressive.',
    topic: 'DRC domain variables'
  },
  {
    id: 'drc-b-008',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'Which DRC expression is equivalent to SELECT * FROM Students WHERE dept = "CS"?',
    options: [
      '{<n, a, d> | <n, a, d> in Students and d = "CS"}',
      '{<n, a> | <n, a, d> in Students}',
      '{<d> | d = "CS"}',
      '{<n, a, d> | d = "CS"}'
    ],
    correctIndex: 0,
    explanation: 'To select all columns with a filter, list all domain variables in both the result and condition, with the filtering condition on the relevant variable.',
    topic: 'selection'
  },
  {
    id: 'drc-b-009',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'In DRC, angle brackets < > are used to:',
    options: [
      'Denote logical implications',
      'List domain variables in the result or condition',
      'Indicate quantifier scope',
      'Define tuple variable ranges'
    ],
    correctIndex: 1,
    explanation: 'Angle brackets in DRC are used to list domain variables, both in the result specification (what to return) and in the condition (tuple membership in a relation).',
    topic: 'syntax rules'
  },
  {
    id: 'drc-b-010',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'What does {<x> | exists y(<x, y> in Enrolls and y = "DBMS")} return?',
    options: [
      'All courses named DBMS',
      'All students enrolled in DBMS',
      'All student-course pairs where the course is DBMS',
      'The count of DBMS enrollments'
    ],
    correctIndex: 1,
    explanation: 'The result <x> projects only the student name, and the condition filters for enrollments where the course is DBMS. So it returns names of students enrolled in DBMS.',
    topic: 'DRC domain variables'
  },
  {
    id: 'drc-b-011',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'Which operator maps DRC conditions to SQL WHERE clauses?',
    options: [
      'The angle brackets',
      'The vertical bar',
      'The logical connectives (and, or, not)',
      'The quantifiers'
    ],
    correctIndex: 2,
    explanation: 'Logical connectives "and", "or", and "not" in DRC conditions map directly to AND, OR, and NOT in SQL WHERE clauses.',
    topic: 'operator mapping'
  },
  {
    id: 'drc-b-012',
    calculusType: 'DRC',
    difficulty: 'basic',
    question: 'What is wrong with {<n> | n in Students}?',
    options: [
      'Nothing, it is valid DRC',
      'DRC requires angle brackets around the condition tuple',
      'A domain variable cannot be "in" a relation without listing all attributes',
      'The result should list all attributes'
    ],
    correctIndex: 2,
    explanation: 'In DRC, a domain variable cannot be directly checked for membership in a relation. You must list all domain variables matching the relation schema: {<n> | <n, a, d> in Students}.',
    topic: 'syntax rules'
  },

  // --- Intermediate DRC (12) ---
  {
    id: 'drc-i-001',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Translate: {<n> | exists a exists d(<n, a, d> in Students and d = "CS" and a > 20)}',
    options: [
      'SELECT name FROM Students WHERE dept = "CS" AND age > 20',
      'SELECT * FROM Students WHERE dept = "CS" OR age > 20',
      'SELECT name, age FROM Students WHERE dept = "CS"',
      'SELECT name FROM Students WHERE dept = "CS"'
    ],
    correctIndex: 0,
    explanation: 'The existential quantifiers bind the domain variables a and d, the condition filters for CS department and age > 20, and the result projects only the name.',
    topic: 'selection'
  },
  {
    id: 'drc-i-002',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Translate: {<s> | exists c(<s, c> in Enrolls and c = "DBMS")}',
    options: [
      'SELECT student FROM Enrolls WHERE course = "DBMS"',
      'SELECT course FROM Enrolls WHERE student = "DBMS"',
      'SELECT * FROM Enrolls WHERE course = "DBMS"',
      'SELECT s FROM Students WHERE s in Enrolls'
    ],
    correctIndex: 0,
    explanation: 'The result <s> projects the student variable, and the condition filters for the DBMS course. This is equivalent to selecting students enrolled in DBMS.',
    topic: 'DRC domain variables'
  },
  {
    id: 'drc-i-003',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'What does {<s> | forall c(<s, c> in Enrolls implies c in RequiredCourses)} express?',
    options: [
      'Students who take at least one required course',
      'Students who take only required courses',
      'Students who take all required courses',
      'Students who take no required courses'
    ],
    correctIndex: 1,
    explanation: 'For every enrollment (s, c), if s is enrolled in c, then c must be in RequiredCourses. This means every course the student takes is a required course.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-i-004',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Translate: {<s, g> | exists c(<s, c, g> in Grades and g = "A")}',
    options: [
      'All grades for all students',
      'Student-grade pairs where the grade is A',
      'All courses with grade A',
      'Students who got an A in some course'
    ],
    correctIndex: 1,
    explanation: 'The result <s, g> projects student and grade, and the condition filters for grade = "A". This returns pairs of students and their A grades.',
    topic: 'projection'
  },
  {
    id: 'drc-i-005',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'What is wrong with {<n> | <n, a> in Students and a > 20} if Students has schema {name, age, dept}?',
    options: [
      'Nothing, it is valid',
      'The tuple <n, a> has only 2 elements but Students has 3 attributes',
      'Domain variables cannot be compared with >',
      'The result should include all attributes'
    ],
    correctIndex: 1,
    explanation: 'In DRC, the tuple in the condition must match the arity (number of attributes) of the relation. Students has 3 attributes, so the condition must use <n, a, d> not <n, a>.',
    topic: 'common mistakes'
  },
  {
    id: 'drc-i-006',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Translate: {<s> | not exists c(<s, c> in Enrolls and c = "DBMS")}',
    options: [
      'Students enrolled in DBMS',
      'Students not enrolled in DBMS',
      'Courses not taken by any student',
      'Students who take no courses at all'
    ],
    correctIndex: 1,
    explanation: 'The negated existential means there is no enrollment record for student s in the DBMS course, returning students not enrolled in DBMS.',
    topic: 'negation'
  },
  {
    id: 'drc-i-007',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Which DRC expression finds students who are enrolled in both "DBMS" and "OS"?',
    options: [
      '{<s> | exists c1 exists c2(<s, c1> in Enrolls and <s, c2> in Enrolls and c1 = "DBMS" and c2 = "OS")}',
      '{<s> | exists c(<s, c> in Enrolls and c = "DBMS" and c = "OS")}',
      '{<s> | <s, "DBMS", "OS"> in Enrolls}',
      '{<s> | <s, "DBMS"> in Enrolls or <s, "OS"> in Enrolls}'
    ],
    correctIndex: 0,
    explanation: 'To check enrollment in two different courses, we need two separate existential quantifiers with different course variables, each linked to the student via Enrolls.',
    topic: 'joins'
  },
  {
    id: 'drc-i-008',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'In DRC, how do you express "there exists a student with GPA above 3.5"?',
    options: [
      'exists s exists a exists d(<s, a, d> in Students and a > 3.5)',
      'exists x(x > 3.5)',
      'exists s(s in Students and s.gpa > 3.5)',
      'forall s(s in Students implies s.gpa > 3.5)'
    ],
    correctIndex: 0,
    explanation: 'In DRC, existential quantification requires binding domain variables and checking tuple membership in a relation with the filtering condition.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-i-009',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'What does {<n, a> | <n, a, d> in Students and not exists c2(<n, c2> in Enrolls)} return?',
    options: [
      'Students who are enrolled in at least one course',
      'Students who are not enrolled in any course',
      'All students with their age',
      'Students who take no courses and their ages'
    ],
    correctIndex: 3,
    explanation: 'The query returns name-age pairs for students who have no enrollment records. The "not exists" with the Enrolls relation filters for students not enrolled in any course.',
    topic: 'negation'
  },
  {
    id: 'drc-i-010',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Translate: {<s> | forall c(<s, c> in Enrolls implies exists g(<s, c, g> in Grades and g >= 3.0))}',
    options: [
      'Students who have at least one grade above 3.0',
      'Students whose all enrolled courses have a grade >= 3.0',
      'Students enrolled in courses with grade >= 3.0',
      'Courses where all students have grade >= 3.0'
    ],
    correctIndex: 1,
    explanation: 'For every enrollment of student s in course c, there must exist a grade record showing g >= 3.0. This means all of the student\'s grades are at least 3.0.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-i-011',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'Can the following DRC expression return duplicates: {<n> | <n, a, d> in Students and d = "CS"}?',
    options: [
      'Yes, if multiple students have the same name',
      'No, DRC always returns a set',
      'Yes, but only if the relation has duplicate rows',
      'No, because domain variables are unique'
    ],
    correctIndex: 1,
    explanation: 'DRC is based on set semantics, so it cannot return duplicate tuples. Even if multiple students have the same name, each name appears only once in the result.',
    topic: 'syntax rules'
  },
  {
    id: 'drc-i-012',
    calculusType: 'DRC',
    difficulty: 'intermediate',
    question: 'What does {<s, c> | <s, c> in Enrolls and forall g(<s, c, g> in Grades implies g = "A")} express?',
    options: [
      'All student-course enrollments',
      'Enrollments where the student got an A',
      'Enrollments where if there is a grade, it must be A',
      'Enrollments where no grade has been assigned'
    ],
    correctIndex: 2,
    explanation: 'For every grade record for this student-course pair, the grade must be A. This captures enrollments where all recorded grades (if any) are A.',
    topic: 'quantifiers'
  },

  // --- Advanced DRC (11) ---
  {
    id: 'drc-a-001',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Translate: {<s> | exists c1(<s, c1> in Enrolls and forall c2(<s, c2> in Enrolls implies c2 = c1))}',
    options: [
      'Students enrolled in exactly one course',
      'Students enrolled in at least one course',
      'Students enrolled in all courses',
      'Students enrolled in more than one course'
    ],
    correctIndex: 0,
    explanation: 'There exists a course c1 that s is enrolled in, and for every enrollment c2 of s, c2 must equal c1. This means s is enrolled in exactly one course.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-a-002',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'What does {<s> | forall c1(<s, c1> in Enrolls implies exists c2(<s, c2> in Enrolls and c2 != c1))} express?',
    options: [
      'Students enrolled in exactly one course',
      'Students enrolled in at least two courses',
      'Students enrolled in no courses',
      'Students enrolled in all courses'
    ],
    correctIndex: 1,
    explanation: 'For every course c1 that s takes, there must exist a different course c2 that s also takes. This is only possible if s is enrolled in at least two courses.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-a-003',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Translate: {<s> | not exists c1(<s, c1> in Enrolls and not exists c2(<s, c2> in Enrolls and c2 != c1))}',
    options: [
      'Students enrolled in at most one course',
      'Students enrolled in at least two courses',
      'Students enrolled in exactly one course',
      'Students enrolled in no courses'
    ],
    correctIndex: 1,
    explanation: 'Double negation: it is not the case that there exists a course where no other course exists. This means for every course, another different course exists, requiring at least two enrollments.',
    topic: 'negation'
  },
  {
    id: 'drc-a-004',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Can DRC express "find the student with the maximum GPA" without using aggregate functions?',
    options: [
      'Yes: {<s> | exists a(<s, a> in Students and forall a2(forall s2(<s2, a2> in Students implies a >= a2)))}',
      'Yes: {<s> | <s, a> in Students and a = max(gpa)}',
      'No, DRC cannot express maximum without aggregates',
      'Yes, but only for numeric GPA values'
    ],
    correctIndex: 0,
    explanation: 'DRC can express maximum using universal quantification: s has GPA a, and for all other students s2 with GPA a2, a >= a2. This does not require aggregate functions.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-a-005',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'What is wrong with {<n> | exists a(<n, a> in Students and a > 20)} if Students has schema {name, age, dept}?',
    options: [
      'Nothing, it is valid',
      'The tuple <n, a> has 2 elements but Students has 3 attributes',
      'Domain variable a cannot be compared',
      'The exists quantifier is incorrectly placed'
    ],
    correctIndex: 1,
    explanation: 'The condition tuple must match the arity of the relation. Students has 3 attributes (name, age, dept), so the condition must use <n, a, d> with 3 domain variables, not <n, a> with 2.',
    topic: 'common mistakes'
  },
  {
    id: 'drc-a-006',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Translate: {<s> | forall c(<s, c> in Enrolls implies exists g(<s, c, g> in Grades and g = "A"))}',
    options: [
      'Students who get an A in at least one course',
      'Students who get an A in every course they are enrolled in',
      'Students enrolled in courses graded A',
      'Students whose all grades are A across all courses'
    ],
    correctIndex: 1,
    explanation: 'For every course the student is enrolled in, there must exist a grade record showing grade A. This means all of the student\'s grades are A.',
    topic: 'quantifiers'
  },
  {
    id: 'drc-a-007',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Can DRC express "students who take all courses that Alice takes"?',
    options: [
      'Yes: {<s> | forall c(<s, c> in Enrolls or not <"Alice", c> in Enrolls)}',
      'Yes: {<s> | forall c(<"Alice", c> in Enrolls implies <s, c> in Enrolls)}',
      'No, DRC cannot compare students this way',
      'Yes, but only if s != "Alice"'
    ],
    correctIndex: 1,
    explanation: 'For every course c, if Alice is enrolled in c, then s must also be enrolled in c. This correctly expresses "takes all courses that Alice takes."',
    topic: 'quantifiers'
  },
  {
    id: 'drc-a-008',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'What does {<s1, s2> | exists c(<s1, c> in Enrolls and <s2, c> in Enrolls and s1 != s2)} return?',
    options: [
      'Pairs of students who take different courses',
      'Pairs of students who share at least one course',
      'Pairs of students where one takes a course the other does not',
      'All student pairs'
    ],
    correctIndex: 1,
    explanation: 'There exists a course c such that both s1 and s2 are enrolled in it, and s1 and s2 are different students. This returns pairs of students who share at least one course.',
    topic: 'joins'
  },
  {
    id: 'drc-a-009',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Translate: {<s> | not exists c(<s, c> in Enrolls and forall c2(<s, c2> in Enrolls implies c2 = c))}',
    options: [
      'Students enrolled in exactly one course',
      'Students NOT enrolled in exactly one course (zero or two+ courses)',
      'Students enrolled in no courses',
      'Students enrolled in multiple courses'
    ],
    correctIndex: 1,
    explanation: 'The inner part says "s is enrolled in exactly one course" (there exists c and all enrollments equal c). The outer negation says it is NOT the case, so s takes either zero or two or more courses.',
    topic: 'negation'
  },
  {
    id: 'drc-a-010',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'Is {<s> | <s> in Students} valid DRC if Students has schema {name, age, dept}?',
    options: [
      'Yes, it selects all students',
      'No, because <s> has 1 element but Students has 3 attributes',
      'Yes, but it returns only names',
      'No, DRC does not support single-variable tuples'
    ],
    correctIndex: 1,
    explanation: 'In DRC, tuple membership requires matching arity. Students has 3 attributes, so the condition must use <s, a, d> not <s>. Single-variable tuples cannot match 3-attribute relations.',
    topic: 'common mistakes'
  },
  {
    id: 'drc-a-011',
    calculusType: 'DRC',
    difficulty: 'advanced',
    question: 'What does {<s, c> | <s, c> in Enrolls and not exists g(<s, c, g> in Grades)} express?',
    options: [
      'All enrollments with grades',
      'Enrollments that have no grade assigned',
      'Students who have not been graded',
      'Courses with no students'
    ],
    correctIndex: 1,
    explanation: 'For the student-course pair (s, c) enrolled in Enrolls, there is no grade record in Grades. This identifies enrollments awaiting grading.',
    topic: 'negation'
  },

  // ============================================================
  // GENERAL QUESTIONS (25)
  // ============================================================

  // --- Basic General (8) ---
  {
    id: 'gen-b-001',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'Relational calculus is based on which mathematical logic?',
    options: [
      'Propositional logic',
      'First-order predicate logic',
      'Modal logic',
      'Temporal logic'
    ],
    correctIndex: 1,
    explanation: 'Relational calculus (both TRC and DRC) is based on first-order predicate logic, which allows quantification over variables and predicates over relations.',
    topic: 'theory'
  },
  {
    id: 'gen-b-002',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'Which of the following is NOT a valid logical operator in relational calculus?',
    options: [
      'and',
      'or',
      'not',
      'xor'
    ],
    correctIndex: 3,
    explanation: 'Standard relational calculus uses and, or, not, and implication. XOR is not a primitive operator, though it can be expressed using the others.',
    topic: 'operators'
  },
  {
    id: 'gen-b-003',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'What does the symbol "in" represent in relational calculus?',
    options: [
      'Logical conjunction',
      'Set membership (tuple belongs to relation)',
      'Implication',
      'Existential quantification'
    ],
    correctIndex: 1,
    explanation: 'The "in" symbol (∈) represents set membership, indicating that a tuple (in TRC) or a tuple of domain values (in DRC) belongs to a relation.',
    topic: 'operators'
  },
  {
    id: 'gen-b-004',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'Relational calculus is a:',
    options: [
      'Procedural query language',
      'Non-procedural (declarative) query language',
      'Data manipulation language',
      'Data definition language'
    ],
    correctIndex: 1,
    explanation: 'Relational calculus is declarative (non-procedural) — it specifies WHAT to retrieve without describing HOW to retrieve it. This contrasts with relational algebra which is procedural.',
    topic: 'theory'
  },
  {
    id: 'gen-b-005',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'TRC and DRC are:',
    options: [
      'Equally expressive (can express the same queries)',
      'TRC is more powerful than DRC',
      'DRC is more powerful than TRC',
      'They express completely different things'
    ],
    correctIndex: 0,
    explanation: 'TRC and DRC are provably equivalent in expressive power. Any query expressible in TRC can also be expressed in DRC and vice versa.',
    topic: 'theory'
  },
  {
    id: 'gen-b-006',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'What is a "safe" relational calculus expression?',
    options: [
      'One that does not use quantifiers',
      'One that produces a finite result and only references values in the database',
      'One that only uses SELECT statements',
      'One that does not use negation'
    ],
    correctIndex: 1,
    explanation: 'A safe expression is one that is guaranteed to produce a finite result and only references domain values that appear in the database. Unsafe expressions could theoretically produce infinite results.',
    topic: 'theory'
  },
  {
    id: 'gen-b-007',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'The "implies" operator (→) in logic is equivalent to:',
    options: [
      'A and B',
      'A or B',
      'not A or B',
      'not A and not B'
    ],
    correctIndex: 2,
    explanation: 'Material implication A → B is logically equivalent to (not A) or (B). This is a fundamental equivalence used when translating TRC/DRC implications to SQL.',
    topic: 'operators'
  },
  {
    id: 'gen-b-008',
    calculusType: 'General',
    difficulty: 'basic',
    question: 'Which of these is a correct use of the existential quantifier?',
    options: [
      'exists x(P(x)) means "for all x, P(x) is true"',
      'exists x(P(x)) means "there is at least one x for which P(x) is true"',
      'exists x(P(x)) means "P(x) is false for all x"',
      'exists x(P(x)) means "exactly one x satisfies P(x)"'
    ],
    correctIndex: 1,
    explanation: 'The existential quantifier asserts that there exists at least one value in the domain that makes the predicate true. It does not specify uniqueness or count.',
    topic: 'operators'
  },

  // --- Intermediate General (9) ---
  {
    id: 'gen-i-001',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'How is the universal quantifier "forall" typically expressed in SQL?',
    options: [
      'Using the ALL keyword directly',
      'Using NOT EXISTS with a negated condition',
      'Using a GROUP BY clause',
      'Using the HAVING clause'
    ],
    correctIndex: 1,
    explanation: 'SQL does not have a direct "forall" construct. The standard translation is: forall X: P(X) becomes NOT EXISTS X: NOT P(X). This double negation pattern is the standard approach.',
    topic: 'SQL equivalents'
  },
  {
    id: 'gen-i-002',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'What is the key difference between procedural and non-procedural query languages?',
    options: [
      'Procedural languages are faster',
      'Procedural languages specify how to get results; non-procedural specify what results to get',
      'Non-procedural languages cannot use conditions',
      'Procedural languages cannot use joins'
    ],
    correctIndex: 1,
    explanation: 'Procedural languages (like relational algebra) describe the sequence of operations. Non-procedural languages (like relational calculus) describe the desired result without specifying the method.',
    topic: 'theory'
  },
  {
    id: 'gen-i-003',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'In relational calculus, what prevents infinite result sets?',
    options: [
      'The use of the "in" operator',
      'Safety constraints that restrict variables to values appearing in the database',
      'The use of quantifiers',
      'The limitation to two tuple variables'
    ],
    correctIndex: 1,
    explanation: 'Safety constraints ensure that variables range only over values that actually appear in the database relations, preventing the possibility of infinite result sets.',
    topic: 'theory'
  },
  {
    id: 'gen-i-004',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'Which of these TRC/DRC patterns corresponds to a SQL self-join?',
    options: [
      '{T | T in R and T.a > 20}',
      '{T | exists S(S in R and T.a = S.b)}',
      '{T | forall S(S in R implies T.a = S.a)}',
      '{T | not exists S(S in R)}'
    ],
    correctIndex: 1,
    explanation: 'Using two tuple variables from the same relation with a condition comparing their attributes models a self-join: {T | exists S(S in R and T.a = S.b)}.',
    topic: 'joins'
  },
  {
    id: 'gen-i-005',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'What is the SQL equivalent of the TRC/DRC expression for "all students take DBMS"?',
    options: [
      'SELECT COUNT(*) FROM Students',
      'NOT EXISTS (SELECT * FROM Students WHERE NOT EXISTS (SELECT * FROM Enrolls WHERE student = name AND course = "DBMS"))',
      'SELECT * FROM Students WHERE course = "DBMS"',
      'SELECT DISTINCT student FROM Enrolls'
    ],
    correctIndex: 1,
    explanation: 'The "forall students take DBMS" pattern uses nested NOT EXISTS: there does not exist a student for whom there does not exist an enrollment in DBMS. This is the standard double-negation translation.',
    topic: 'SQL equivalents'
  },
  {
    id: 'gen-i-006',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'In which year was the relational model proposed by E.F. Codd?',
    options: [
      '1960',
      '1970',
      '1980',
      '1990'
    ],
    correctIndex: 1,
    explanation: 'E.F. Codd proposed the relational model in 1970 in his seminal paper "A Relational Model of Data for Large Shared Data Banks."',
    topic: 'theory'
  },
  {
    id: 'gen-i-007',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'Which quantifier pattern expresses "at least one" in relational calculus?',
    options: [
      'forall x(P(x))',
      'exists x(P(x))',
      'not forall x(P(x))',
      'exists x(forall y(P(x, y)))'
    ],
    correctIndex: 1,
    explanation: '"At least one" is directly expressed by the existential quantifier: exists x(P(x)) asserts there is at least one x satisfying P.',
    topic: 'operators'
  },
  {
    id: 'gen-i-008',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'Which quantifier pattern expresses "at most one" in relational calculus?',
    options: [
      'exists x(P(x))',
      'forall x(P(x))',
      'exists x(P(x) and forall y(P(y) implies y = x))',
      'not exists x(P(x))'
    ],
    correctIndex: 2,
    explanation: '"At most one" means there exists an x satisfying P, and for any y satisfying P, y must equal x (uniqueness). This combines existential and universal quantifiers.',
    topic: 'operators'
  },
  {
    id: 'gen-i-009',
    calculusType: 'General',
    difficulty: 'intermediate',
    question: 'What is the Codd\'s theorem about relational calculus?',
    options: [
      'Relational calculus is faster than SQL',
      'Relational calculus and relational algebra have the same expressive power',
      'Relational calculus cannot handle NULLs',
      'Relational calculus is not Turing-complete'
    ],
    correctIndex: 1,
    explanation: 'Codd\'s theorem states that relational calculus and relational algebra are equivalent in expressive power — any query expressible in one can be expressed in the other.',
    topic: 'theory'
  },

  // --- Advanced General (8) ---
  {
    id: 'gen-a-001',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'Which of these queries CANNOT be expressed in first-order relational calculus?',
    options: [
      'Find all students with GPA > 3.0',
      'Find students who take all courses',
      'Find pairs of students who take exactly the same set of courses',
      'Find the transitive closure of a graph (ancestors in a family tree)'
    ],
    correctIndex: 3,
    explanation: 'Transitive closure ("find all ancestors") requires recursion, which is beyond the expressive power of first-order logic. This requires Datalog or recursive SQL (WITH RECURSIVE).',
    topic: 'theory'
  },
  {
    id: 'gen-a-002',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'What does "alphabet" mean in the context of relational calculus?',
    options: [
      'The set of all valid SQL keywords',
      'The set of relation names, attribute names, constant values, and operator symbols used in expressions',
      'The alphabet used to name tables',
      'The character encoding of the database'
    ],
    correctIndex: 1,
    explanation: 'The alphabet of relational calculus includes relation names, attribute names, domain constants, variables, operators (logical connectives), quantifiers, and parentheses.',
    topic: 'syntax rules'
  },
  {
    id: 'gen-a-003',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'Is the following a safe TRC expression: {T | T.name = "Bob" or T.name != "Bob"}?',
    options: [
      'Yes, it is safe because it references only database values',
      'No, it is unsafe because it could match any relation with a name attribute',
      'Yes, it returns all tuples',
      'No, it is a syntax error'
    ],
    correctIndex: 0,
    explanation: 'This expression is safe. It references only the constant "Bob" and attributes of T. It returns all tuples from the implicit relation (since the condition is always true), which is finite.',
    topic: 'theory'
  },
  {
    id: 'gen-a-004',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'Which logical equivalence is used when translating "forall X: P(X) implies Q(X)" to SQL?',
    options: [
      'NOT EXISTS X: P(X) AND NOT Q(X)',
      'EXISTS X: P(X) AND Q(X)',
      'NOT EXISTS X: NOT P(X) OR Q(X)',
      'EXISTS X: NOT P(X) OR Q(X)'
    ],
    correctIndex: 0,
    explanation: 'The universal quantifier with implication translates via DeMorgan\'s law: forall X: P → Q is equivalent to NOT EXISTS X: P AND NOT Q. This is the fundamental SQL translation pattern.',
    topic: 'SQL equivalents'
  },
  {
    id: 'gen-a-005',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'What is the difference between "free" and "bound" variables in relational calculus?',
    options: [
      'Free variables are not used in conditions; bound variables are',
      'Free variables appear outside quantifier scope; bound variables appear within quantifier scope',
      'Free variables are optional; bound variables are required',
      'There is no difference'
    ],
    correctIndex: 1,
    explanation: 'A variable is bound if it falls within the scope of a quantifier (exists or forall). A variable is free if it is not within any quantifier\'s scope. Only free variables appear in the result.',
    topic: 'theory'
  },
  {
    id: 'gen-a-006',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'Why is the expression {T | T.age > 20 or not T.age > 20} considered safe?',
    options: [
      'It is not safe because it returns an infinite set',
      'It is safe because the condition is always true, so it returns the finite relation',
      'It is safe because it uses only database values',
      'It is unsafe because it uses negation'
    ],
    correctIndex: 1,
    explanation: 'Although the condition is a tautology (always true), the result is still the finite set of tuples in the relation. Safety depends on the result being finite and referencing only database values, not on the condition being selective.',
    topic: 'theory'
  },
  {
    id: 'gen-a-007',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'Which of these is an unsafe relational calculus expression?',
    options: [
      '{T | T in Students and T.age > 20}',
      '{T | T.age > 20 or T.age <= 20}',
      '{T | T.name = "Alice" or T.name != "Alice"}',
      '{x | x > 0} where x is a domain variable not linked to any relation'
    ],
    correctIndex: 3,
    explanation: 'An unsafe expression is one where the domain variable x ranges over an infinite domain (all integers > 0) and is not restricted to values appearing in any relation. This could produce an infinite result.',
    topic: 'theory'
  },
  {
    id: 'gen-a-008',
    calculusType: 'General',
    difficulty: 'advanced',
    question: 'In the context of TRC, what does "rename" or "alias" mean?',
    options: [
      'Changing the name of a relation permanently',
      'Giving a tuple variable a different name to avoid ambiguity in self-joins',
      'Converting TRC to DRC',
      'Renaming an attribute in the result'
    ],
    correctIndex: 1,
    explanation: 'When the same relation appears multiple times in a query, different tuple variables (aliases) are used to distinguish them. For example, T and S both "in Students" represent potentially different tuples.',
    topic: 'tuple variables'
  }
];
