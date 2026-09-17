import { tokenize } from './src/engine/tokenizer';

const input = "{T | T in Students AND T.dept = 'CS' AND T.gpa >= 3.5}";
const tokens = tokenize(input);
tokens.forEach((t, i) => {
  console.log(`${i}: type=${t.type}  value="${t.value}"  pos=${t.position}  col=${t.column}`);
});
