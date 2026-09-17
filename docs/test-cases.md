# Test Cases

## TC-01: Basic TRC Translation
- **Input:** `{T | T in Students AND T.age > 20}`
- **Expected:** `SELECT * FROM Students WHERE age > 20;`
- **Status:** PASS

## TC-02: TRC Projection
- **Input:** `{T.name | T in Students}`
- **Expected:** `SELECT name FROM Students;`
- **Status:** PASS

## TC-03: TRC with Multiple Conditions
- **Input:** `{T | T in Students AND T.dept = 'CS' AND T.gpa >= 3.5}`
- **Expected:** `SELECT * FROM Students WHERE dept = 'CS' AND gpa >= 3.5;`
- **Status:** PASS

## TC-04: TRC with EXISTS
- **Input:** `{T.name | T in Students AND exists E(E in Enrollment AND T.name = E.student AND E.course = 'DBMS')}`
- **Expected:** `SELECT name FROM Students WHERE EXISTS (SELECT * FROM Enrollment WHERE Students.name = Enrollment.student AND course = 'DBMS');`
- **Status:** PASS

## TC-05: TRC with FORALL
- **Input:** `{T.name | T in Students AND forall E(E in Enrollment AND T.name = E.student implies E.grade = 'A')}`
- **Expected:** `SELECT name FROM Students WHERE NOT EXISTS (SELECT * FROM Enrollment WHERE Students.name = Enrollment.student AND grade != 'A');`
- **Status:** PASS

## TC-06: Basic DRC Translation
- **Input:** `{<name, age> | <name, age, dept> in Students AND dept = 'CS'}`
- **Expected:** `SELECT name, age FROM Students WHERE dept = 'CS';`
- **Status:** PASS

## TC-07: DRC with EXISTS
- **Input:** `{<s> | exists c(<s, c> in Enrolls AND c = 'DBMS')}`
- **Expected:** `SELECT s FROM Enrolls WHERE c = 'DBMS';`
- **Status:** PASS

## TC-08: Empty Query
- **Input:** ``
- **Expected:** Error message: "Query is empty"
- **Status:** PASS

## TC-09: Missing Pipe
- **Input:** `{T Students}`
- **Expected:** Error message about missing pipe
- **Status:** PASS

## TC-10: Mismatched Braces
- **Input:** `{T | T in Students`
- **Expected:** Error message about mismatched braces
- **Status:** PASS

## TC-11: Unicode Operators
- **Input:** `{T | T in Students ∧ T.age > 20}`
- **Expected:** `SELECT * FROM Students WHERE age > 20;`
- **Status:** PASS

## TC-12: Text Operators
- **Input:** `{T | T in Students and T.age > 20}`
- **Expected:** `SELECT * FROM Students WHERE age > 20;`
- **Status:** PASS

## TC-13: IMPLIES Operator
- **Input:** `{T.name | T in Students AND forall E(E in Enrollment AND T.name = E.student implies E.grade = 'A')}`
- **Expected:** SQL with NOT EXISTS ... NOT pattern
- **Status:** PASS

## TC-14: Negation
- **Input:** `{T | T in Students AND not exists S(S in Students AND S.dept = T.dept AND S.gpa > T.gpa)}`
- **Expected:** SQL with NOT EXISTS pattern
- **Status:** PASS

## TC-15: Query History Persistence
- **Action:** Translate 3 queries, refresh page
- **Expected:** All 3 queries appear in history
- **Status:** PASS

## TC-16: Day/Night Mode Toggle
- **Action:** Click theme toggle
- **Expected:** Theme switches between light and dark
- **Status:** PASS

## TC-17: PDF Download
- **Action:** Click Download > Download as PDF
- **Expected:** Print dialog opens with formatted report
- **Status:** PASS

## TC-18: Command Palette
- **Action:** Press Ctrl+K
- **Expected:** Command palette overlay appears
- **Status:** PASS

## TC-19: Keyboard Shortcuts
- **Action:** Press Ctrl+1 through Ctrl+4
- **Expected:** Tab switches accordingly
- **Status:** PASS

## TC-20: Builder Modal
- **Action:** Click Builder in navbar
- **Expected:** Modal with developer and mentor info appears
- **Status:** PASS
