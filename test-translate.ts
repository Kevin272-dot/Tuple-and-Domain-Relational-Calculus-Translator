import { translateToSQL } from './src/engine/translator';
import { sampleQueries } from './src/engine/examples';

console.log('=== Testing all sample queries ===\n');

sampleQueries.forEach((q, i) => {
  console.log(`--- ${q.id} ---`);
  console.log(`Input:  ${q.query}`);
  const r = translateToSQL(q.query);
  console.log(`SQL:\n${r.sql}`);
  console.log(`OK: ${r.success}`);
  if (r.error) console.log(`Error: ${r.error}`);
  console.log();
});
