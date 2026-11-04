#!/usr/bin/env node
/**
 * Agentic-SDD CLI (v1.0.0)
 * Spec-Driven Development Framework for Autonomous Multi-Agent Teams
 * Zero-Dependency Pure Node.js ESM
 *
 * Commands:
 *   npx @dzutr/agentic-sdd init   [--target <dir>] [--name <project>] [--preset <preset>] [--ide <ide>] [--force]
 *   npx @dzutr/agentic-sdd doctor [--target <dir>]
 *   npx @dzutr/agentic-sdd verify [--target <dir>]
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runVerify } from '../templates/scripts/verify-standards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const TEMPLATES_DIR = path.join(PACKAGE_ROOT, 'templates');

const VALID_PRESETS = ['web-frontend', 'fullstack-edge', 'backend-api', 'generic'];
const VALID_IDES = ['all', 'antigravity', 'cursor', 'claude', 'windsurf', 'copilot'];

const PRESET_DEFAULTS = {
  'web-frontend': {
    techStack: 'Modern Web Frontend (Astro / React / Vue / Next.js + Tailwind CSS)',
    buildCmd: 'npm run build',
    testCmd: 'npm test'
  },
  'fullstack-edge': {
    techStack: 'Fullstack & Edge Serverless (SSG/SSR + Edge Workers + SQL/NoSQL)',
    buildCmd: 'npm run build',
    testCmd: 'npm test'
  },
  'backend-api': {
    techStack: 'Backend API & Microservices (Node.js / Go / Python / Rust + PostgreSQL)',
    buildCmd: 'npm run build',
    testCmd: 'npm test'
  },
  'generic': {
    techStack: 'Universal Software Engineering Stack',
    buildCmd: 'npm run build',
    testCmd: 'npm test'
  }
};

const ROLE_FILES = [
  '00-orchestrator.md',
  '01-planner.md',
  '02-developer.md',
  '03-tester.md',
  '04-reviewer.md'
];

const TRACKING_DIRS = ['plan', 'report', 'task', 'log', 'done'];

function parseCliArgs(argv) {
  const args = argv.slice(2);
  const command = args[0] && !args[0].startsWith('-') ? args[0] : 'help';
  const flags = {
    target: process.cwd(),
    name: '',
    preset: 'fullstack-edge',
    ide: 'all',
    stack: '',
    buildCmd: '',
    testCmd: '',
    lang: 'en',
    force: false,
    help: false,
    version: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--target' || arg === '-t') {
      flags.target = args[++i] || process.cwd();
    } else if (arg === '--name' || arg === '-n') {
      flags.name = args[++i] || '';
    } else if (arg === '--preset' || arg === '-p') {
      flags.preset = args[++i] || 'fullstack-edge';
    } else if (arg === '--ide' || arg === '-i') {
      flags.ide = args[++i] || 'all';
    } else if (arg === '--stack') {
      flags.stack = args[++i] || '';
    } else if (arg === '--build-cmd') {
      flags.buildCmd = args[++i] || '';
    } else if (arg === '--test-cmd') {
      flags.testCmd = args[++i] || '';
    } else if (arg === '--lang' || arg === '-l') {
      flags.lang = args[++i] || 'en';
    } else if (arg === '--force' || arg === '-f') {
      flags.force = true;
    } else if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    }
  }

  return { command, flags };
}

function inferProjectName(targetDir) {
  const pkgJsonPath = path.join(targetDir, 'package.json');
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
      if (pkg.name && typeof pkg.name === 'string') {
        return pkg.name;
      }
    } catch {
      // Ignore malformed package.json and fallback to folder name
    }
  }
  return path.basename(path.resolve(targetDir)) || 'my-agentic-project';
}

function applyPlaceholders(content, context) {
  return content
    .replace(/\{\{PROJECT_NAME\}\}/g, context.projectName)
    .replace(/\{\{TECH_STACK\}\}/g, context.techStack)
    .replace(/\{\{BUILD_COMMAND\}\}/g, context.buildCommand)
    .replace(/\{\{TEST_COMMAND\}\}/g, context.testCommand);
}

function writeTemplateFile(srcPath, destPath, context, force, stats) {
  const dir = path.dirname(destPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const exists = fs.existsSync(destPath);
  if (exists && !force) {
    stats.skipped.push(destPath);
    return 'SKIPPED';
  }

  const raw = fs.readFileSync(srcPath, 'utf8');
  const rendered = applyPlaceholders(raw, context);
  fs.writeFileSync(destPath, rendered, 'utf8');

  if (exists) {
    stats.overwritten.push(destPath);
    return 'OVERWRITTEN';
  } else {
    stats.created.push(destPath);
    return 'CREATED';
  }
}

function printHelp() {
  console.log(`
👑 Agentic-SDD v1.0.0 — Spec-Driven Framework for Autonomous Multi-Agent Teams

Usage:
  npx @dzutr/agentic-sdd <command> [options]

Commands:
  init      Initialize Agentic-SDD roles, tracking SOPs, presets & IDE bridges
  doctor    Verify health and completeness of Agentic-SDD setup
  verify    Audit UI source files (Web Interface Guidelines) & Spec structure
  help      Show this help message

Options for 'init':
  --target, -t <dir>       Target project directory (default: current directory)
  --name, -n <name>        Project name (default: inferred from package.json or folder)
  --preset, -p <preset>    AGENTS.md preset: web-frontend | fullstack-edge | backend-api | generic
  --ide, -i <ide>          IDE adapters: all | antigravity | cursor | claude | windsurf | copilot
  --stack <text>           Custom tech stack description
  --build-cmd <cmd>        Custom build command (default: "npm run build")
  --test-cmd <cmd>         Custom test command (default: "npm test")
  --force, -f              Overwrite existing files (default: safe idempotent mode)

Examples:
  npx @dzutr/agentic-sdd init --preset fullstack-edge --ide all
  npx @dzutr/agentic-sdd doctor --target ./my-app
  npx @dzutr/agentic-sdd verify --target ./my-app
`);
}

function runInit(flags) {
  const startTime = Date.now();
  const targetDir = path.resolve(flags.target);
  const preset = VALID_PRESETS.includes(flags.preset) ? flags.preset : 'fullstack-edge';
  const presetConfig = PRESET_DEFAULTS[preset];

  const context = {
    projectName: flags.name || inferProjectName(targetDir),
    techStack: flags.stack || presetConfig.techStack,
    buildCommand: flags.buildCmd || presetConfig.buildCmd,
    testCommand: flags.testCmd || presetConfig.testCmd
  };

  const selectedIdes = flags.ide
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter((s) => VALID_IDES.includes(s));
  const installAllIdes = selectedIdes.length === 0 || selectedIdes.includes('all');

  const stats = {
    created: [],
    overwritten: [],
    skipped: []
  };

  // 1. Install .agent-roles/ (Single Source of Truth)
  for (const roleFile of ROLE_FILES) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, 'roles', roleFile),
      path.join(targetDir, '.agent-roles', roleFile),
      context,
      flags.force,
      stats
    );
  }

  // 2. Install Multi-IDE Adapters
  if (installAllIdes || selectedIdes.includes('antigravity')) {
    for (const roleFile of ROLE_FILES) {
      writeTemplateFile(
        path.join(TEMPLATES_DIR, 'roles', roleFile),
        path.join(targetDir, '.antigravity', 'roles', roleFile),
        context,
        flags.force,
        stats
      );
    }
  }

  if (installAllIdes || selectedIdes.includes('cursor')) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, 'adapters', 'cursor-rule.mdc'),
      path.join(targetDir, '.cursor', 'rules', 'agentic-sdd.mdc'),
      context,
      flags.force,
      stats
    );
  }

  if (installAllIdes || selectedIdes.includes('claude')) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, 'adapters', 'CLAUDE.md'),
      path.join(targetDir, 'CLAUDE.md'),
      context,
      flags.force,
      stats
    );
  }

  if (installAllIdes || selectedIdes.includes('windsurf')) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, 'adapters', '.windsurfrules'),
      path.join(targetDir, '.windsurfrules'),
      context,
      flags.force,
      stats
    );
  }

  if (installAllIdes || selectedIdes.includes('copilot')) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, 'adapters', 'copilot-instructions.md'),
      path.join(targetDir, '.github', 'copilot-instructions.md'),
      context,
      flags.force,
      stats
    );
  }

  // 3. Install tracking/ SOP directory structure & templates
  for (const subDir of TRACKING_DIRS) {
    const fullSubDir = path.join(targetDir, 'tracking', subDir);
    if (!fs.existsSync(fullSubDir)) {
      fs.mkdirSync(fullSubDir, { recursive: true });
    }
  }

  const trackingMappings = [
    ['tracking/plan/_TEMPLATE.md', 'tracking/plan/_TEMPLATE.md'],
    ['tracking/report/_TEMPLATE.md', 'tracking/report/_TEMPLATE.md'],
    ['tracking/report/_GATEKEEPING_TEMPLATE.md', 'tracking/report/_GATEKEEPING_TEMPLATE.md'],
    ['tracking/task/DAILY_TASKS.md', 'tracking/task/DAILY_TASKS.md'],
    ['tracking/log/CHANGELOG.md', 'tracking/log/CHANGELOG.md'],
    ['tracking/done/.gitkeep', 'tracking/done/.gitkeep']
  ];

  for (const [srcRel, destRel] of trackingMappings) {
    writeTemplateFile(
      path.join(TEMPLATES_DIR, srcRel),
      path.join(targetDir, destRel),
      context,
      flags.force,
      stats
    );
  }

  // 4. Install AGENTS.md preset
  writeTemplateFile(
    path.join(TEMPLATES_DIR, 'presets', `${preset}.md`),
    path.join(targetDir, 'AGENTS.md'),
    context,
    flags.force,
    stats
  );

  // 5. Install scripts/verify-standards.js
  writeTemplateFile(
    path.join(TEMPLATES_DIR, 'scripts', 'verify-standards.js'),
    path.join(targetDir, 'scripts', 'verify-standards.js'),
    context,
    flags.force,
    stats
  );

  const elapsedMs = Date.now() - startTime;
  console.log(`\n🚀 Agentic-SDD Initialized Successfully in ${elapsedMs}ms!`);
  console.log(`   Project Name : ${context.projectName}`);
  console.log(`   Target Dir   : ${targetDir}`);
  console.log(`   Preset       : ${preset}`);
  console.log(`   IDE Bridges  : ${installAllIdes ? 'all (Antigravity, Cursor, Claude, Windsurf, Copilot)' : selectedIdes.join(', ')}`);
  console.log(`   Created      : ${stats.created.length} file(s)`);
  console.log(`   Overwritten  : ${stats.overwritten.length} file(s)`);
  console.log(`   Skipped      : ${stats.skipped.length} existing file(s) (safe idempotent mode)\n`);
  console.log(`👉 Next Steps:`);
  console.log(`   1. Run health check : npx @dzutr/agentic-sdd doctor --target "${targetDir}"`);
  console.log(`   2. Run verification : npx @dzutr/agentic-sdd verify --target "${targetDir}"\n`);
}

function runDoctor(flags) {
  const targetDir = path.resolve(flags.target);
  const checks = [];

  // 1. Check 5 canonical roles in .agent-roles/
  for (const roleFile of ROLE_FILES) {
    const p = path.join(targetDir, '.agent-roles', roleFile);
    checks.push({
      name: `Role file .agent-roles/${roleFile}`,
      passed: fs.existsSync(p) && fs.statSync(p).size > 0,
      remedy: `Restore missing role file via: npx @dzutr/agentic-sdd init --target "${targetDir}"`
    });
  }

  // 2. Check 5 tracking subdirectories
  for (const subDir of TRACKING_DIRS) {
    const p = path.join(targetDir, 'tracking', subDir);
    checks.push({
      name: `Tracking directory tracking/${subDir}/`,
      passed: fs.existsSync(p) && fs.statSync(p).isDirectory(),
      remedy: `Recreate directory tracking/${subDir}/ via: npx agentic-sdd init --target "${targetDir}"`
    });
  }

  // 3. Check core tracking templates
  const requiredTemplates = [
    'tracking/plan/_TEMPLATE.md',
    'tracking/report/_TEMPLATE.md',
    'tracking/report/_GATEKEEPING_TEMPLATE.md',
    'tracking/task/DAILY_TASKS.md',
    'tracking/log/CHANGELOG.md'
  ];
  for (const relPath of requiredTemplates) {
    const p = path.join(targetDir, relPath);
    checks.push({
      name: `SOP Template ${relPath}`,
      passed: fs.existsSync(p) && fs.statSync(p).size > 0,
      remedy: `Restore ${relPath} via: npx agentic-sdd init --target "${targetDir}"`
    });
  }

  // 4. Check AGENTS.md
  const agentsPath = path.join(targetDir, 'AGENTS.md');
  checks.push({
    name: 'Root engineering rules AGENTS.md',
    passed: fs.existsSync(agentsPath) && fs.statSync(agentsPath).size > 0,
    remedy: `Generate AGENTS.md via: npx agentic-sdd init --target "${targetDir}"`
  });

  // 5. Check IDE Adapters (at least one adapter present)
  const adapterPaths = [
    path.join(targetDir, '.antigravity', 'roles', '00-orchestrator.md'),
    path.join(targetDir, '.cursor', 'rules', 'agentic-sdd.mdc'),
    path.join(targetDir, 'CLAUDE.md'),
    path.join(targetDir, '.windsurfrules'),
    path.join(targetDir, '.github', 'copilot-instructions.md')
  ];
  const activeAdapters = adapterPaths.filter((p) => fs.existsSync(p));
  checks.push({
    name: `Multi-IDE Adapter Bridge (${activeAdapters.length} detected)`,
    passed: activeAdapters.length > 0,
    remedy: `Install IDE adapters via: npx @dzutr/agentic-sdd init --ide all --target "${targetDir}"`
  });

  // 6. Check scripts/verify-standards.js
  const verifyScriptPath = path.join(targetDir, 'scripts', 'verify-standards.js');
  checks.push({
    name: 'Verification script scripts/verify-standards.js',
    passed: fs.existsSync(verifyScriptPath) && fs.statSync(verifyScriptPath).size > 0,
    remedy: `Install verification script via: npx @dzutr/agentic-sdd init --target "${targetDir}"`
  });

  const failedChecks = checks.filter((c) => !c.passed);

  console.log('\n🩺 Agentic-SDD Doctor — Configuration Health Check');
  console.log(`   Target Directory: ${targetDir}\n`);

  for (const check of checks) {
    const icon = check.passed ? '✅ [PASS]' : '❌ [FAIL]';
    console.log(`   ${icon} ${check.name}`);
  }

  if (failedChecks.length === 0) {
    console.log(`\n🟢 RESULT: 100% HEALTHY (PASS) — All ${checks.length}/${checks.length} checks passed.\n`);
    process.exit(0);
  } else {
    console.error(`\n🔴 RESULT: UNHEALTHY (FAIL) — ${failedChecks.length} of ${checks.length} check(s) failed.\n`);
    console.error('🔧 Actionable Remediation:');
    for (const fc of failedChecks) {
      console.error(`   • ${fc.name} ➔ ${fc.remedy}`);
    }
    console.error('');
    process.exit(1);
  }
}

function main() {
  const { command, flags } = parseCliArgs(process.argv);

  if (flags.version) {
    console.log('1.0.0');
    process.exit(0);
  }

  if (flags.help || command === 'help') {
    printHelp();
    process.exit(0);
  }

  switch (command) {
    case 'init':
      runInit(flags);
      break;
    case 'doctor':
      runDoctor(flags);
      break;
    case 'verify': {
      const res = runVerify(flags.target);
      process.exit(res.passed ? 0 : 1);
      break;
    }
    default:
      console.error(`❌ Unknown command: "${command}"`);
      printHelp();
      process.exit(1);
  }
}

main();
