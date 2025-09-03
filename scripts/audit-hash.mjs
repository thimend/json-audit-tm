import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { auditJson } from '../dist/index.js';

const oldPath = process.argv[2];
const newPath = process.argv[3];
const nameArg = process.argv[4];
const outDir  = process.argv[5] || 'test-file';

if (!oldPath || !newPath || !nameArg) {
  console.error('Uso: node scripts/audit-hash.mjs <old.json> <new.json> <nome> [outDir]');
  process.exit(1);
}

const before = JSON.parse(readFileSync(oldPath, 'utf8'));
const after  = JSON.parse(readFileSync(newPath, 'utf8'));

const result = auditJson({
  id: '00000000-0000-0000-0000-000000000001',
  name: nameArg,
  before,
  after,
  options: { displayNameMap: { cliente: 'Nome do Cliente', pef: 'PEF' } }
});

const payload = JSON.stringify(result, null, 2);
const hash = createHash('sha256').update(payload).digest('hex').slice(0, 12);
const safeName = String(nameArg).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9._-]/g, '');
const outPath = resolve(outDir, `${hash}.${safeName}.json`);

mkdirSync(outDir, { recursive: true });
writeFileSync(outPath, payload, 'utf8');
console.log(outPath);
