#!/usr/bin/env node
/**
 * Agentic-SDD — Standalone Repository Exporter
 * Exports the entire packages/agentic-sdd/ toolkit to an independent directory
 * for standalone Git & GitHub publishing with isolated Local Git Identity.
 *
 * Usage:
 *   node packages/agentic-sdd/scripts/export-standalone-repo.js [--out <target_dir>] [--force]
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SOURCE_ROOT = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const args = argv.slice(2);
  let outDir = path.join(os.homedir(), 'Documents', 'agentic-sdd');
  let force = false;

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--out' || args[i] === '-o') && args[i + 1]) {
      outDir = args[++i];
    } else if (args[i] === '--force' || args[i] === '-f') {
      force = true;
    }
  }

  return { outDir: path.resolve(outDir), force };
}

function copyRecursive(src, dest, force, copiedFiles = []) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    if (path.basename(src) === 'node_modules' || path.basename(src) === '.git') {
      return copiedFiles;
    }
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src);
    for (const entry of entries) {
      copyRecursive(path.join(src, entry), path.join(dest, entry), force, copiedFiles);
    }
  } else if (stat.isFile()) {
    if (!fs.existsSync(dest) || force) {
      const parent = path.dirname(dest);
      if (!fs.existsSync(parent)) {
        fs.mkdirSync(parent, { recursive: true });
      }
      fs.copyFileSync(src, dest);
      copiedFiles.push(dest);
    }
  }
  return copiedFiles;
}

function main() {
  const { outDir, force } = parseArgs(process.argv);

  console.log('\n📦 Agentic-SDD Standalone Repository Exporter');
  console.log(`   Source Package : ${SOURCE_ROOT}`);
  console.log(`   Destination    : ${outDir}\n`);

  const copied = copyRecursive(SOURCE_ROOT, outDir, true);

  console.log(`✅ Successfully exported ${copied.length} file(s) to: ${outDir}\n`);
  console.log('🔑 Multi-Account Local Git Setup Instructions:');
  console.log(`   cd "${outDir}"`);
  console.log('   git init -b main');
  console.log('   git config user.name "Your OpenSource Name"');
  console.log('   git config user.email "your-opensource-email@example.com"');
  console.log('   git add .');
  console.log('   git commit -m "feat: initial release of Agentic-SDD v1.0.0"\n');
}

main();
