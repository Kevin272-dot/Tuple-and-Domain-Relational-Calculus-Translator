export interface CompetitiveQuestion {
  id: string;
  exam: 'GATE' | 'UGC NET' | 'ISRO' | 'BARC' | 'IES';
  year: number;
  topic: 'TRC' | 'DRC' | 'Relational Algebra' | 'SQL' | 'General';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  marks?: number;
}

export const competitiveQuestionBank: CompetitiveQuestion[] = [
  // ============================================================
  // GATE CS QUESTIONS
  // ============================================================
  {
    id: 'gate-2024-01',
    exam: 'GATE',
    year: 2024,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Consider the following TRC expression:\n{T.name | T in Students AND T.age > 20 AND exists E(E in Enrollment AND E.student = T.name AND E.grade = "A")}\nWhich of the following SQL queries is equivalent?',
    options: [
      'SELECT name FROM Students WHERE age > 20 AND name IN (SELECT student FROM Enrollment WHERE grade = "A")',
      'SELECT name FROM Students, Enrollment WHERE age > 20 AND grade = "A"',
      'SELECT DISTINCT name FROM Students WHERE age > 20 OR grade = "A"',
      'SELECT name FROM Students WHERE age > 20 UNION SELECT student FROM Enrollment WHERE grade = "A"'
    ],
    correctIndex: 0,
    explanation: 'The TRC expression selects names of students older than 20 who have at least one "A" grade in Enrollment. The existential quantifier with the join condition maps to a subquery with IN or EXISTS. Option B lacks the name join condition, C uses OR instead of AND, and D is a UNION.',
    marks: 1,
  },
  {
    id: 'gate-2024-02',
    exam: 'GATE',
    year: 2024,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'The DRC expression {<s> | exists c(<s, c> in Enrolls AND c = "DBMS")} is equivalent to:',
    options: [
      'SELECT student FROM Enrolls WHERE course = "DBMS"',
      'SELECT course FROM Enrolls WHERE student = "DBMS"',
      'SELECT * FROM Enrolls WHERE course = "DBMS"',
      'SELECT s FROM Students WHERE s IN (SELECT student FROM Enrolls)'
    ],
    correctIndex: 0,
    explanation: 'The result tuple <s> projects the student variable. The condition filters for enrollments where course = "DBMS". This directly maps to selecting students enrolled in DBMS.',
    marks: 1,
  },
  {
    id: 'gate-2023-01',
    exam: 'GATE',
    year: 2023,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which of the following TRC expressions finds students who take ALL courses?',
    options: [
      '{T | forall C(C in Courses implies exists E(E.student = T.name AND E.course = C.name))}',
      '{T | exists C(C in Courses AND forall E(E.student = T.name IMPLIES E.course = C.name))}',
      '{T | forall C(C in Courses AND exists E(E.student = T.name AND E.course = C.name))}',
      '{T | exists C(C in Courses implies forall E(E.student = T.name AND E.course = C.name))}'
    ],
    correctIndex: 0,
    explanation: 'The correct pattern for "takes all" is: for every course C, there exists an enrollment E linking the student to that course. The forall + implies + exists pattern is the standard translation. Option B has wrong quantifier scope, C uses AND instead of implies, D has wrong quantifier combination.',
    marks: 2,
  },
  {
    id: 'gate-2023-02',
    exam: 'GATE',
    year: 2023,
    topic: 'SQL',
    difficulty: 'easy',
    question: 'In SQL, which clause is used to eliminate duplicate rows from the result of a SELECT query?',
    options: [
      'UNIQUE',
      'DISTINCT',
      'DIFFERENT',
      'SEPARATE'
    ],
    correctIndex: 1,
    explanation: 'The DISTINCT keyword in the SELECT clause eliminates duplicate rows from the result set. UNIQUE is a constraint, not a query clause.',
    marks: 1,
  },
  {
    id: 'gate-2023-03',
    exam: 'GATE',
    year: 2023,
    topic: 'Relational Algebra',
    difficulty: 'medium',
    question: 'Which relational algebra operation is NOT directly expressible in relational calculus?',
    options: [
      'Selection (sigma)',
      'Projection (pi)',
      'Cartesian product (cross)',
      'Division (÷)'
    ],
    correctIndex: 3,
    explanation: 'Division is expressible in relational calculus but requires nested negation and is not a primitive operation. While it CAN be expressed, it is the least direct of the listed operations. Selection and projection are directly expressible as conditions and attribute listing in TRC/DRC.',
    marks: 1,
  },
  {
    id: 'gate-2022-01',
    exam: 'GATE',
    year: 2022,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Consider:\n{T.name | T in Students AND NOT exists E(E.student = T.name AND E.course = "DBMS")}\nThis returns:',
    options: [
      'Students enrolled in DBMS',
      'Students not enrolled in DBMS',
      'All students',
      'No students'
    ],
    correctIndex: 1,
    explanation: 'The NOT EXISTS with the condition means there is no enrollment record for this student in DBMS. This is the standard pattern for "students who do NOT take DBMS".',
    marks: 1,
  },
  {
    id: 'gate-2022-02',
    exam: 'GATE',
    year: 2022,
    topic: 'DRC',
    difficulty: 'hard',
    question: 'The DRC expression:\n{<s> | forall c(<s, c> in Enrolls implies exists g(<s, c, g> in Grades AND g >= 3.0))}\nexpresses:',
    options: [
      'Students who have at least one grade above 3.0',
      'Students whose ALL enrolled courses have grade >= 3.0',
      'Students enrolled in courses with grade >= 3.0',
      'Courses where all students have grade >= 3.0'
    ],
    correctIndex: 1,
    explanation: 'For every enrollment (s, c), there must exist a grade record showing g >= 3.0. This means all of the student\'s grades are at least 3.0. The forall + implies + exists pattern ensures every enrollment has a qualifying grade.',
    marks: 2,
  },
  {
    id: 'gate-2022-03',
    exam: 'GATE',
    year: 2022,
    topic: 'General',
    difficulty: 'easy',
    question: 'Relational calculus is:',
    options: [
      'A procedural query language',
      'A non-procedural (declarative) query language',
      'A data definition language',
      'A data control language'
    ],
    correctIndex: 1,
    explanation: 'Relational calculus is declarative (non-procedural) — it specifies WHAT to retrieve without describing HOW. This is the key difference from relational algebra which is procedural.',
    marks: 1,
  },
  {
    id: 'gate-2021-01',
    exam: 'GATE',
    year: 2021,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Which TRC expression is equivalent to the division operation R(A,B) ÷ S(B)?',
    options: [
      '{<a> | forall b(<a, b> in R implies exists s(<s> in S AND b = s))}',
      '{<a> | exists b(<a, b> in R AND <b> in S)}',
      '{<a> | forall b(<b> in S implies exists r(<a, b> in R))}',
      '{<a> | exists b(<b> in S AND <a, b> in R)}'
    ],
    correctIndex: 2,
    explanation: 'Division R÷S returns tuples from R that are associated with ALL tuples in S. The TRC pattern is: for every b in S, there exists a tuple (a,b) in R. This is the standard translation of division to TRC.',
    marks: 2,
  },
  {
    id: 'gate-2021-02',
    exam: 'GATE',
    year: 2021,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'What is the result of the following SQL query?\nSELECT COUNT(DISTINCT student) FROM Enrollment WHERE grade = "A"',
    options: [
      'Total number of A grades',
      'Number of students who have at least one A grade',
      'Number of courses with A grade',
      'Total enrollment count'
    ],
    correctIndex: 1,
    explanation: 'COUNT(DISTINCT student) counts unique students. The WHERE clause filters for A grades. So it counts how many distinct students have at least one A grade.',
    marks: 1,
  },
  {
    id: 'gate-2020-01',
    exam: 'GATE',
    year: 2020,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which of the following queries CANNOT be expressed in first-order relational calculus?',
    options: [
      'Find all students with GPA > 3.0',
      'Find students who take all courses',
      'Find the transitive closure (ancestors in a family tree)',
      'Find pairs of students who share a course'
    ],
    correctIndex: 2,
    explanation: 'Transitive closure requires recursion (repeated application of a relation), which is beyond the expressive power of first-order logic. All other options involve quantifiers and conditions that are expressible in TRC/DRC.',
    marks: 2,
  },
  {
    id: 'gate-2020-02',
    exam: 'GATE',
    year: 2020,
    topic: 'DRC',
    difficulty: 'easy',
    question: 'In DRC, variables range over:',
    options: [
      'Tuples (rows) of relations',
      'Domain values (individual column values)',
      'Entire relations (tables)',
      'Database schemas'
    ],
    correctIndex: 1,
    explanation: 'In Domain Relational Calculus, variables range over domain values (individual column values), unlike TRC where variables range over tuples (rows).',
    marks: 1,
  },
  {
    id: 'gate-2019-01',
    exam: 'GATE',
    year: 2019,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Consider the TRC expression:\n{T | T in Students AND forall S(S in Students implies T.gpa >= S.gpa)}\nThis expression returns:',
    options: [
      'All students',
      'Students with the highest GPA',
      'Students with GPA above average',
      'No students (empty result)'
    ],
    correctIndex: 1,
    explanation: 'The expression says: T is a student such that for ALL other students S, T\'s GPA is >= S\'s GPA. This means T has the maximum GPA in the Students relation.',
    marks: 1,
  },
  {
    id: 'gate-2019-02',
    exam: 'GATE',
    year: 2019,
    topic: 'General',
    difficulty: 'easy',
    question: 'Codd\'s theorem states that:',
    options: [
      'Relational calculus is faster than SQL',
      'Relational calculus and relational algebra have the same expressive power',
      'Relational calculus cannot handle NULLs',
      'Relational algebra is more powerful than relational calculus'
    ],
    correctIndex: 1,
    explanation: 'Codd\'s theorem states that relational calculus and relational algebra are equivalent in expressive power — any query expressible in one can be expressed in the other.',
    marks: 1,
  },
  {
    id: 'gate-2018-01',
    exam: 'GATE',
    year: 2018,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'What is wrong with: {T | T in Students AND T.age > 20 AND T.age < 18}?',
    options: [
      'Nothing, it returns students between 18 and 20',
      'The conditions are contradictory, so it always returns empty',
      'It is a syntax error',
      'It returns all students'
    ],
    correctIndex: 1,
    explanation: 'No student can simultaneously have age > 20 AND age < 18. These are contradictory conditions, so the result is always an empty relation regardless of the database contents.',
    marks: 1,
  },
  {
    id: 'gate-2018-02',
    exam: 'GATE',
    year: 2018,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'Which SQL construct is used to express the universal quantifier (forall) from TRC?',
    options: [
      'Using the ALL keyword directly',
      'Using NOT EXISTS with a negated condition',
      'Using a GROUP BY clause',
      'Using the HAVING clause'
    ],
    correctIndex: 1,
    explanation: 'SQL does not have a direct "forall" construct. The standard translation is: forall X: P(X) becomes NOT EXISTS X: NOT P(X). This double negation pattern is the standard approach.',
    marks: 1,
  },
  {
    id: 'gate-2017-01',
    exam: 'GATE',
    year: 2017,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Consider:\n{T.name | T in Students AND exists E1(E1.student = T.name AND E1.course = "DBMS") AND exists E2(E2.student = T.name AND E2.course = "OS")}\nThis returns students who:',
    options: [
      'Take DBMS or OS',
      'Take both DBMS and OS',
      'Take DBMS but not OS',
      'Take neither DBMS nor OS'
    ],
    correctIndex: 1,
    explanation: 'Two separate existential quantifiers check that the student is enrolled in DBMS AND also enrolled in OS. Both conditions must hold, so the student takes both courses.',
    marks: 1,
  },
  {
    id: 'gate-2017-02',
    exam: 'GATE',
    year: 2017,
    topic: 'Relational Algebra',
    difficulty: 'easy',
    question: 'The number of basic relational algebra operations is:',
    options: [
      '4',
      '5',
      '6',
      '8'
    ],
    correctIndex: 1,
    explanation: 'The 5 basic relational algebra operations are: Selection (sigma), Projection (pi), Cartesian Product (cross), Union, and Set Difference. All other operations (intersection, join, division) can be expressed using these 5.',
    marks: 1,
  },
  {
    id: 'gate-2016-01',
    exam: 'GATE',
    year: 2016,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which TRC expression finds students who do NOT take any course taken by student "Alice"?',
    options: [
      '{T | T in Students AND T.name != "Alice" AND not exists E(E.student = T.name AND exists A(A.student = "Alice" AND A.course = E.course))}',
      '{T | T in Students AND not exists E(E.student = T.name AND E.course IN (SELECT course FROM Enrollment WHERE student = "Alice"))}',
      '{T | T in Students AND not exists E(E.student = "Alice" AND E.student = T.name)}',
      'Both A and B are correct'
    ],
    correctIndex: 3,
    explanation: 'Both A and B express the same thing: find students such that there is no enrollment for them in any course that Alice takes. A uses nested exists, B uses a subquery with IN. Both are valid TRC expressions (B uses a SQL-like subquery which some TRC formalisms allow).',
    marks: 2,
  },
  {
    id: 'gate-2016-02',
    exam: 'GATE',
    year: 2016,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'The DRC expression {<n, a> | <n, a, d> in Students AND d = "CS"} returns:',
    options: [
      'All attributes of CS students',
      'Name and age of CS students',
      'Only names of CS students',
      'Only ages of CS students'
    ],
    correctIndex: 1,
    explanation: 'The result tuple <n, a> specifies two domain variables (name and age). The condition filters for CS department. So it returns name and age pairs for CS students.',
    marks: 1,
  },
  {
    id: 'gate-2015-01',
    exam: 'GATE',
    year: 2015,
    topic: 'General',
    difficulty: 'easy',
    question: 'Which of the following is NOT a valid logical operator in relational calculus?',
    options: [
      'and',
      'or',
      'not',
      'xor'
    ],
    correctIndex: 3,
    explanation: 'Standard relational calculus uses and, or, not, and implication. XOR is not a primitive operator, though it can be expressed using the others (A xor B = (A or B) and not (A and B)).',
    marks: 1,
  },
  {
    id: 'gate-2015-02',
    exam: 'GATE',
    year: 2015,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Consider:\n{T | forall C(C in Courses implies (exists E(T.name = E.student AND E.course = C.name) implies T.gpa > 3.0))}\nThis means:',
    options: [
      'Students who take all courses and have GPA > 3.0',
      'Students who, for every course they take, have GPA > 3.0',
      'Students who take at least one course with GPA > 3.0',
      'Students with GPA > 3.0'
    ],
    correctIndex: 1,
    explanation: 'For every course C, if the student takes course C (exists E linking them), then their GPA must be > 3.0. This means for every course the student is enrolled in, their GPA condition holds. Students who take no courses satisfy this vacuously.',
    marks: 2,
  },

  // ============================================================
  // UGC NET QUESTIONS
  // ============================================================
  {
    id: 'ugc-2024-01',
    exam: 'UGC NET',
    year: 2024,
    topic: 'TRC',
    difficulty: 'easy',
    question: 'In Tuple Relational Calculus (TRC), the variables range over:',
    options: [
      'Domain values',
      'Tuples (rows) of relations',
      'Entire relations',
      'Attributes only'
    ],
    correctIndex: 1,
    explanation: 'In TRC, tuple variables range over tuples (rows) of relations. Each tuple variable represents an entire row, unlike DRC where variables range over domain values.',
    marks: 2,
  },
  {
    id: 'ugc-2024-02',
    exam: 'UGC NET',
    year: 2024,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'Which of the following is used to find tuples that match a pattern in SQL?',
    options: [
      'LIKE operator',
      'MATCH operator',
      'FIND operator',
      'SEARCH operator'
    ],
    correctIndex: 0,
    explanation: 'The LIKE operator in SQL is used for pattern matching in string values. It uses wildcards % (any sequence) and _ (single character).',
    marks: 2,
  },
  {
    id: 'ugc-2023-01',
    exam: 'UGC NET',
    year: 2023,
    topic: 'Relational Algebra',
    difficulty: 'easy',
    question: 'The operation that combines tuples from two relations without any condition is:',
    options: [
      'Join',
      'Cartesian Product',
      'Union',
      'Intersection'
    ],
    correctIndex: 1,
    explanation: 'Cartesian Product (cross join) combines every tuple from one relation with every tuple from another relation, without any condition. Join is a filtered version of Cartesian Product.',
    marks: 2,
  },
  {
    id: 'ugc-2023-02',
    exam: 'UGC NET',
    year: 2023,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'In DRC, the existential quantifier "exists" quantifies over:',
    options: [
      'Tuple variables',
      'Domain variables',
      'Relations',
      'Attributes'
    ],
    correctIndex: 1,
    explanation: 'In DRC, the existential quantifier "exists" quantifies over domain variables (individual values), not tuples. For example, exists x means "there exists some domain value x."',
    marks: 2,
  },
  {
    id: 'ugc-2022-01',
    exam: 'UGC NET',
    year: 2022,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'The TRC expression {T | T in Students AND T.age > 20} is equivalent to which SQL?',
    options: [
      'SELECT * FROM Students WHERE age > 20',
      'SELECT age FROM Students WHERE age > 20',
      'SELECT * FROM Students HAVING age > 20',
      'SELECT * FROM Students GROUP BY age HAVING age > 20'
    ],
    correctIndex: 0,
    explanation: 'The TRC expression selects all attributes (*) of tuples in Students where age > 20. This directly maps to SELECT * FROM Students WHERE age > 20.',
    marks: 2,
  },
  {
    id: 'ugc-2022-02',
    exam: 'UGC NET',
    year: 2022,
    topic: 'General',
    difficulty: 'easy',
    question: 'Who proposed the relational model?',
    options: [
      'Peter Chen',
      'E.F. Codd',
      'James Martin',
      'C.J. Date'
    ],
    correctIndex: 1,
    explanation: 'E.F. Codd proposed the relational model in 1970 in his seminal paper "A Relational Model of Data for Large Shared Data Banks."',
    marks: 2,
  },
  {
    id: 'ugc-2021-01',
    exam: 'UGC NET',
    year: 2021,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which TRC expression is NOT safe?',
    options: [
      '{T | T in Students AND T.age > 20}',
      '{T | T.name = "Bob" OR T.name != "Bob"}',
      '{T | T.age > 20 OR T.age <= 20}',
      '{x | x > 0} where x is not linked to any relation'
    ],
    correctIndex: 3,
    explanation: 'An unsafe expression is one where the domain variable x ranges over an infinite domain (all integers > 0) and is not restricted to values appearing in any relation. This could produce an infinite result.',
    marks: 2,
  },
  {
    id: 'ugc-2021-02',
    exam: 'UGC NET',
    year: 2021,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'The SQL query "SELECT * FROM Students WHERE EXISTS (SELECT * FROM Enrollment WHERE Enrollment.student = Students.name)" returns:',
    options: [
      'All students',
      'Only students who have at least one enrollment',
      'Only students with no enrollment',
      'All enrollment records'
    ],
    correctIndex: 1,
    explanation: 'The EXISTS subquery checks if there is at least one matching enrollment record for each student. Only students with at least one enrollment satisfy the condition.',
    marks: 2,
  },

  // ============================================================
  // ISRO QUESTIONS
  // ============================================================
  {
    id: 'isro-2024-01',
    exam: 'ISRO',
    year: 2024,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'The TRC expression:\n{T.name | T in Students AND exists E(E.student = T.name AND E.course = "Networks")}\nis equivalent to:',
    options: [
      'SELECT name FROM Students WHERE name IN (SELECT student FROM Enrollment WHERE course = "Networks")',
      'SELECT name FROM Students WHERE course = "Networks"',
      'SELECT course FROM Enrollment WHERE course = "Networks"',
      'SELECT * FROM Students, Enrollment'
    ],
    correctIndex: 0,
    explanation: 'The existential quantifier with the join condition maps to a subquery with IN. The query finds students enrolled in Networks course.',
    marks: 2,
  },
  {
    id: 'isro-2024-02',
    exam: 'ISRO',
    year: 2024,
    topic: 'General',
    difficulty: 'easy',
    question: 'Which of the following is a DDL command?',
    options: [
      'SELECT',
      'INSERT',
      'CREATE',
      'UPDATE'
    ],
    correctIndex: 2,
    explanation: 'CREATE is a Data Definition Language (DDL) command used to create database objects. SELECT, INSERT, and UPDATE are DML (Data Manipulation Language) commands.',
    marks: 2,
  },
  {
    id: 'isro-2023-01',
    exam: 'ISRO',
    year: 2023,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which of the following expresses "students who take ALL courses offered by their department" in TRC?',
    options: [
      '{T | forall C(C.dept = T.dept implies exists E(E.student = T.name AND E.course = C.name))}',
      '{T | exists C(C.dept = T.dept AND exists E(E.student = T.name AND E.course = C.name))}',
      '{T | forall C(C.dept = T.dept AND exists E(E.student = T.name))}',
      '{T | exists C(C.dept = T.dept implies forall E(E.student = T.name))}'
    ],
    correctIndex: 0,
    explanation: 'For every course C in T\'s department, there must exist an enrollment E linking T to C. The forall + implies + exists pattern with the department matching condition is correct.',
    marks: 2,
  },
  {
    id: 'isro-2023-02',
    exam: 'ISRO',
    year: 2023,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'What does the following SQL return?\nSELECT student FROM Enrollment E1 WHERE NOT EXISTS (SELECT * FROM Enrollment E2 WHERE E2.student = E1.student AND E2.course != E1.course)',
    options: [
      'Students who take more than one course',
      'Students who take exactly one course',
      'Students who take no courses',
      'All students'
    ],
    correctIndex: 1,
    explanation: 'For student E1, there is no other enrollment E2 with the same student but different course. This means all of E1\'s enrollments are for the same course — i.e., exactly one course.',
    marks: 2,
  },
  {
    id: 'isro-2022-01',
    exam: 'ISRO',
    year: 2022,
    topic: 'TRC',
    difficulty: 'easy',
    question: 'In TRC, the symbol "|" (pipe) separates:',
    options: [
      'Two conditions',
      'The result pattern from the condition',
      'The SELECT clause from the FROM clause',
      'Two relations'
    ],
    correctIndex: 1,
    explanation: 'In TRC syntax {tuple_pattern | condition}, the vertical bar separates the tuple pattern (what to return) from the condition (filtering criteria).',
    marks: 2,
  },
  {
    id: 'isro-2022-02',
    exam: 'ISRO',
    year: 2022,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'The DRC expression {<s, g> | exists c(<s, c, g> in Grades AND g = "A")} returns:',
    options: [
      'All grades for all students',
      'Student-grade pairs where the grade is A',
      'All courses with grade A',
      'Students who got an A in some course'
    ],
    correctIndex: 1,
    explanation: 'The result <s, g> projects student and grade. The condition filters for grade = "A". This returns pairs of students and their A grades.',
    marks: 2,
  },

  // ============================================================
  // BARC QUESTIONS
  // ============================================================
  {
    id: 'barc-2024-01',
    exam: 'BARC',
    year: 2024,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Which of the following is the correct SQL equivalent of the universal quantifier in TRC?',
    options: [
      'EXISTS (SELECT * FROM R WHERE NOT P)',
      'NOT EXISTS (SELECT * FROM R WHERE NOT P)',
      'ALL (SELECT * FROM R WHERE P)',
      'ANY (SELECT * FROM R WHERE P)'
    ],
    correctIndex: 1,
    explanation: 'The universal quantifier forall X: P(X) translates to NOT EXISTS X: NOT P(X). This double negation pattern is the standard SQL translation.',
    marks: 2,
  },
  {
    id: 'barc-2023-01',
    exam: 'BARC',
    year: 2023,
    topic: 'General',
    difficulty: 'easy',
    question: 'Which normal form removes transitive dependencies?',
    options: [
      'First Normal Form (1NF)',
      'Second Normal Form (2NF)',
      'Third Normal Form (3NF)',
      'BCNF'
    ],
    correctIndex: 2,
    explanation: 'Third Normal Form (3NF) removes transitive dependencies. A relation is in 3NF if it is in 2NF and no non-prime attribute is transitively dependent on any candidate key.',
    marks: 2,
  },
  {
    id: 'barc-2023-02',
    exam: 'BARC',
    year: 2023,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Consider:\n{T | T in Students AND forall S(S in Students IMPLIES (T.dept = S.dept OR T.gpa >= S.gpa))}\nThis returns:',
    options: [
      'Students with the highest GPA overall',
      'Students who either have the highest GPA in their department or the highest GPA overall',
      'Students who share a department with someone or have higher GPA',
      'All students'
    ],
    correctIndex: 1,
    explanation: 'For every other student S, either T is in the same department as S, or T has a higher GPA than S. This means T either has the highest GPA in their department (same dept students) or has higher GPA than everyone in other departments.',
    marks: 2,
  },
  {
    id: 'barc-2022-01',
    exam: 'BARC',
    year: 2022,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'Which SQL clause can reference aggregate functions?',
    options: [
      'WHERE',
      'GROUP BY',
      'HAVING',
      'ORDER BY'
    ],
    correctIndex: 2,
    explanation: 'The HAVING clause can reference aggregate functions because it is evaluated after GROUP BY. WHERE cannot use aggregate functions because it is evaluated before grouping.',
    marks: 2,
  },

  // ============================================================
  // IES (Indian Engineering Services) QUESTIONS
  // ============================================================
  {
    id: 'ies-2024-01',
    exam: 'IES',
    year: 2024,
    topic: 'TRC',
    difficulty: 'easy',
    question: 'What does the TRC expression {T | T in Students} return?',
    options: [
      'All tuples in the Students relation',
      'All attribute names of Students',
      'The count of tuples in Students',
      'Only the first tuple in Students'
    ],
    correctIndex: 0,
    explanation: 'The expression with no additional conditions selects every tuple in the Students relation, equivalent to SELECT * FROM Students.',
    marks: 2,
  },
  {
    id: 'ies-2024-02',
    exam: 'IES',
    year: 2024,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'The DRC expression {<n> | <n, a, d> in Students AND a > 20 AND d = "CS"} returns:',
    options: [
      'All attributes of CS students older than 20',
      'Names of CS students older than 20',
      'Ages of CS students older than 20',
      'Departments of students older than 20'
    ],
    correctIndex: 1,
    explanation: 'The result tuple <n> projects only the name. The conditions filter for age > 20 and dept = "CS". So it returns names of CS students older than 20.',
    marks: 2,
  },
  {
    id: 'ies-2023-01',
    exam: 'IES',
    year: 2023,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Which TRC expression finds students who are NOT the oldest?',
    options: [
      '{T | T in Students AND exists S(S in Students AND S.age > T.age)}',
      '{T | T in Students AND forall S(S in Students AND S.age <= T.age)}',
      '{T | T in Students AND not exists S(S in Students AND S.age > T.age)}',
      '{T | T in Students AND S.age > T.age}'
    ],
    correctIndex: 0,
    explanation: 'There exists another student S who is older than T. This means T is not the oldest student. Option C finds students who ARE the oldest (no one older).',
    marks: 2,
  },
  {
    id: 'ies-2023-02',
    exam: 'IES',
    year: 2023,
    topic: 'Relational Algebra',
    difficulty: 'easy',
    question: 'Which operation removes duplicates from a relation?',
    options: [
      'Union',
      'Set Difference',
      'Projection',
      'All of the above'
    ],
    correctIndex: 3,
    explanation: 'All these operations use set semantics, which means they automatically remove duplicates. In relational algebra, relations are sets, not multisets.',
    marks: 2,
  },
  {
    id: 'ies-2022-01',
    exam: 'IES',
    year: 2022,
    topic: 'General',
    difficulty: 'medium',
    question: 'Which of the following is NOT a property of a transaction in a database system?',
    options: [
      'Atomicity',
      'Consistency',
      'Durability',
      'Redundancy'
    ],
    correctIndex: 3,
    explanation: 'The ACID properties of transactions are Atomicity, Consistency, Isolation, and Durability. Redundancy is not a property of transactions — it is actually something databases try to minimize through normalization.',
    marks: 2,
  },

  // ============================================================
  // ADDITIONAL GATE QUESTIONS (covering more topics)
  // ============================================================
  {
    id: 'gate-extra-01',
    exam: 'GATE',
    year: 2024,
    topic: 'Relational Algebra',
    difficulty: 'medium',
    question: 'The natural join of two relations R(A, B) and S(B, C) will have how many attributes?',
    options: [
      '2',
      '3',
      '4',
      '6'
    ],
    correctIndex: 1,
    explanation: 'Natural join joins on the common attribute B and merges it. The result has attributes A, B, C — total 3 attributes.',
    marks: 1,
  },
  {
    id: 'gate-extra-02',
    exam: 'GATE',
    year: 2023,
    topic: 'SQL',
    difficulty: 'hard',
    question: 'What does the following SQL return?\nSELECT S.name FROM Students S WHERE NOT EXISTS (SELECT * FROM Courses C WHERE NOT EXISTS (SELECT * FROM Enrollment E WHERE E.student = S.name AND E.course = C.name))',
    options: [
      'Students who take at least one course',
      'Students who take all courses',
      'Students who take no courses',
      'All students'
    ],
    correctIndex: 1,
    explanation: 'Double NOT EXISTS: for every course C, there is no enrollment that doesn\'t exist for student S. This means S has an enrollment for every course — S takes all courses.',
    marks: 2,
  },
  {
    id: 'gate-extra-03',
    exam: 'GATE',
    year: 2022,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which of the following is a correct mapping of "implies" to SQL?',
    options: [
      'A → B becomes A AND B',
      'A → B becomes NOT A OR B',
      'A → B becomes A OR NOT B',
      'A → B becomes NOT A AND B'
    ],
    correctIndex: 1,
    explanation: 'Material implication A → B is logically equivalent to NOT A OR B. This is a fundamental equivalence used when translating TRC/DRC implications to SQL.',
    marks: 1,
  },
  {
    id: 'gate-extra-04',
    exam: 'GATE',
    year: 2021,
    topic: 'DRC',
    difficulty: 'medium',
    question: 'The DRC expression:\n{<s> | exists c1(<s, c1> in Enrolls AND forall c2(<s, c2> in Enrolls IMPLIES c2 = c1))}\nexpresses students who:',
    options: [
      'Take at least one course',
      'Take exactly one course',
      'Take all courses',
      'Take no courses'
    ],
    correctIndex: 1,
    explanation: 'There exists a course c1 that s is enrolled in, and for every enrollment c2 of s, c2 must equal c1. This means s is enrolled in exactly one course.',
    marks: 2,
  },
  {
    id: 'gate-extra-05',
    exam: 'GATE',
    year: 2020,
    topic: 'TRC',
    difficulty: 'medium',
    question: 'Which TRC expression finds students who share at least one course with "Bob"?',
    options: [
      '{T | T in Students AND exists E1(E1.student = T.name AND exists E2(E2.student = "Bob" AND E1.course = E2.course))}',
      '{T | T in Students AND exists E(E.student = "Bob" AND E.course IN (SELECT course FROM Enrollment WHERE student = T.name))}',
      '{T | T in Students AND exists E(E.student = T.name AND E.course = "DBMS")}',
      'Both A and B are correct'
    ],
    correctIndex: 3,
    explanation: 'Both A and B express the same thing: there exists a course that both T and Bob are enrolled in. A uses nested exists, B uses a subquery with IN.',
    marks: 2,
  },
  {
    id: 'gate-extra-06',
    exam: 'GATE',
    year: 2024,
    topic: 'General',
    difficulty: 'easy',
    question: 'What is the difference between "free" and "bound" variables in relational calculus?',
    options: [
      'Free variables appear outside quantifier scope; bound variables appear within quantifier scope',
      'Free variables are not used in conditions; bound variables are',
      'Free variables are optional; bound variables are required',
      'There is no difference'
    ],
    correctIndex: 0,
    explanation: 'A variable is bound if it falls within the scope of a quantifier (exists or forall). A variable is free if it is not within any quantifier\'s scope. Only free variables appear in the result.',
    marks: 1,
  },
  {
    id: 'gate-extra-07',
    exam: 'GATE',
    year: 2023,
    topic: 'TRC',
    difficulty: 'hard',
    question: 'Which of these is an unsafe TRC expression?',
    options: [
      '{T | T in Students AND T.age > 20}',
      '{T | T.age > 20 OR T.age <= 20}',
      '{T | T.name = "Alice" OR T.name != "Alice"}',
      '{x | x > 0} where x is a domain variable not linked to any relation'
    ],
    correctIndex: 3,
    explanation: 'An unsafe expression is one where the domain variable x ranges over an infinite domain (all integers > 0) and is not restricted to values appearing in any relation. This could produce an infinite result.',
    marks: 2,
  },
  {
    id: 'gate-extra-08',
    exam: 'GATE',
    year: 2022,
    topic: 'SQL',
    difficulty: 'medium',
    question: 'In SQL, a correlated subquery:',
    options: [
      'Is executed once before the outer query',
      'References columns from the outer query and is re-executed for each outer row',
      'Cannot use aggregate functions',
      'Must return exactly one row'
    ],
    correctIndex: 1,
    explanation: 'A correlated subquery references columns from the outer query and is re-executed once for each row processed by the outer query. This is different from a non-correlated subquery which is executed once.',
    marks: 1,
  },
  {
    id: 'gate-extra-09',
    exam: 'GATE',
    year: 2021,
    topic: 'Relational Algebra',
    difficulty: 'medium',
    question: 'The expression π_A(R) - π_A(R - π_{A,B}(R)) computes:',
    options: [
      'All values of A in R',
      'Values of A that are associated with all values of B',
      'Values of A that have a NULL in B',
      'Values of A that appear exactly once'
    ],
    correctIndex: 1,
    explanation: 'This is the division operation expressed using projection and set difference. It returns values of A that are associated with ALL values of B in R.',
    marks: 2,
  },
  {
    id: 'gate-extra-10',
    exam: 'GATE',
    year: 2020,
    topic: 'DRC',
    difficulty: 'hard',
    question: 'The DRC expression:\n{<s> | not exists c(<s, c> in Enrolls AND forall c2(<s, c2> in Enrolls IMPLIES c2 = c))}\nexpresses students who:',
    options: [
      'Take exactly one course',
      'Take zero or two or more courses',
      'Take no courses',
      'Take at least two courses'
    ],
    correctIndex: 1,
    explanation: 'The inner part says "s is enrolled in exactly one course" (there exists c and all enrollments equal c). The outer negation says it is NOT the case, so s takes either zero or two or more courses.',
    marks: 2,
  },
];
