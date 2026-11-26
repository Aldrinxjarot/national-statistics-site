// main.ts — hand the site in.
//
// Copies app/ and screenshots/ from this repository into the output
// directory (/output, or $MAKEFUN_OUTPUT_DIR outside the grader) and
// writes /output/dossier.json with buildDossier from the kit's vendored
// library. The copy is a plain file copy, so two runs from the same
// repository produce byte-identical output.

import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory this file lives in.
const repoDir = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

// The scorer's caps for this bounty, so the dossier we write is the one
// the scorer accepts: 160 KiB of dossier text, at most 4 screenshots of
// 256 KiB each, app/ within 993 entries and 16 MiB.
const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16 * 1024 * 1024,
  app_path_max_bytes: 1000,
};

function copyDir(name: string): void {
  const from = join(repoDir, name);
  if (!existsSync(from)) throw new Error(`main.ts: missing ${name}/ in ${repoDir}`);
  cpSync(from, join(outDir, name), { recursive: true });
}

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
copyDir('app');
copyDir('screenshots');

const dossier = buildDossier(outDir, CAPS);
if (dossier.length > 1536 * 1024) {
  throw new Error(`main.ts: dossier.json is ${dossier.length} bytes, over the 1.5 MiB cap`);
}
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log(`main.ts: wrote ${outDir} (dossier.json ${dossier.length} bytes)`);
