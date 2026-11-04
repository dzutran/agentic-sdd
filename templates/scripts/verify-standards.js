#!/usr/bin/env node
/**
 * Agentic-SDD — Automated Web Interface Guidelines & Spec Verification Script
 * Zero-Dependency Pure Node.js ESM
 * Usage: node scripts/verify-standards.js [--target <dir>]
 */

import fs from 'node:fs';
import path from 'node:path';

const UI_EXTENSIONS = new Set(['.vue', '.jsx', '.tsx', '.astro', '.html', '.css', '.svelte']);
const IGNORED_DIRS = new Set([
  'node_modules',
  '.git',
  'dist',
  'build',
  '.astro',
  '.next',
  '.nuxt',
  'coverage',
  '.cache',
  '.tmp'
]);

const FORBIDDEN_TRANSITION = 'transition-' + 'all';
const TRANSITION_REGEX = new RegExp(`\\b${FORBIDDEN_TRANSITION}\\b`);

// Matches ASCII '...' inside common UI text contexts (placeholders, titles, aria-labels, or tag text)
const UI_ELLIPSIS_ATTR_REGEX = /\b(?:placeholder|title|aria-label|alt)\s*=\s*["'][^"']*?\.\.\.[^"']*?["']/;
const UI_ELLIPSIS_TEXT_REGEX = />[^<{\n]*?\.\.\.[^<}\n]*?</;

const REQUIRED_PLAN_SECTIONS = [
  { id: '0.', label: 'Section 0: Clarifications & Edge Cases' },
  { id: '1.', label: 'Section 1: Goal' },
  { id: '2.', label: 'Section 2: Scope' },
  { id: '3.', label: 'Section 3: Action Items Checklist' },
  { id: '4.', label: 'Section 4: Impacted Files' },
  { id: '5.', label: 'Section 5: Acceptance Criteria' }
];

function walkFiles(dirPath, fileList = []) {
  if (!fs.existsSync(dirPath)) return fileList;
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, fileList);
    } else if (entry.isFile()) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

export function runVerify(targetDir = process.cwd(), options = { silent: false }) {
  const resolvedTarget = path.resolve(targetDir);
  const violations = [];
  let scannedUiFiles = 0;
  let scannedPlanFiles = 0;

  // 1. Scan UI files for Web Interface Guidelines compliance
  const allFiles = walkFiles(resolvedTarget);
  for (const filePath of allFiles) {
    const relPath = path.relative(resolvedTarget, filePath).replace(/\\/g, '/');
    if (relPath.startsWith('packages/agentic-sdd/')) continue;

    const ext = path.extname(filePath).toLowerCase();
    if (!UI_EXTENSIONS.has(ext)) continue;

    scannedUiFiles++;
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNo = i + 1;

      if (TRANSITION_REGEX.test(line)) {
        violations.push({
          type: 'UI_TRANSITION',
          file: relPath,
          line: lineNo,
          message: `Forbidden "${FORBIDDEN_TRANSITION}" detected. Specify explicit properties (e.g., transition-colors, transition-transform).`
        });
      }

      if (UI_ELLIPSIS_ATTR_REGEX.test(line) || UI_ELLIPSIS_TEXT_REGEX.test(line)) {
        violations.push({
          type: 'UI_ELLIPSIS',
          file: relPath,
          line: lineNo,
          message: 'Raw ASCII three-dots detected in UI text/attribute. Use Unicode ellipsis "…" (&hellip;) instead.'
        });
      }
    }
  }

  // 2. Validate active Spec files in tracking/plan/
  const planDir = path.join(resolvedTarget, 'tracking', 'plan');
  if (fs.existsSync(planDir)) {
    const planEntries = fs.readdirSync(planDir, { withFileTypes: true });
    for (const entry of planEntries) {
      if (!entry.isFile() || !entry.name.endsWith('.md')) continue;
      if (entry.name === '_TEMPLATE.md' || entry.name.includes('PROPOSAL')) continue;

      scannedPlanFiles++;
      const planPath = path.join(planDir, entry.name);
      const relPlanPath = path.relative(resolvedTarget, planPath).replace(/\\/g, '/');
      const content = fs.readFileSync(planPath, 'utf8');

      for (const req of REQUIRED_PLAN_SECTIONS) {
        const headingPattern = new RegExp(`^##\\s+.*${req.id.replace('.', '\\.')}`, 'm');
        if (!headingPattern.test(content)) {
          violations.push({
            type: 'SPEC_STRUCTURE',
            file: relPlanPath,
            line: 1,
            message: `Missing required SOP heading "${req.label}" in specification.`
          });
        }
      }
    }
  }

  if (!options.silent) {
    console.log('\n🔍 Agentic-SDD Standards & Spec Verification');
    console.log(`   Target Directory : ${resolvedTarget}`);
    console.log(`   UI Files Scanned : ${scannedUiFiles}`);
    console.log(`   Specs Verified   : ${scannedPlanFiles}\n`);

    if (violations.length === 0) {
      console.log('✅ VERIFY PASS: 0 violations found. All UI & Spec standards are 100% compliant.\n');
    } else {
      console.error(`❌ VERIFY FAIL: Found ${violations.length} violation(s):\n`);
      for (const v of violations) {
        console.error(`   [${v.type}] ${v.file}:${v.line} — ${v.message}`);
      }
      console.error('');
    }
  }

  return {
    passed: violations.length === 0,
    scannedUiFiles,
    scannedPlanFiles,
    violations
  };
}

// Execute directly if invoked as main script
const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
if (isMain) {
  const args = process.argv.slice(2);
  let targetDir = process.cwd();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) {
      targetDir = args[i + 1];
      i++;
    }
  }
  const result = runVerify(targetDir);
  process.exit(result.passed ? 0 : 1);
}
