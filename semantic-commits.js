import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const stateFilePath = './.husky/.commit-state';
const semanticRegex = /^(feat|fix|docs|style|refactor|test|chore|perf)(\(\w+\))?: .{1,150}$/;

function checkDependencies() {
  const huskyDir = path.join(__dirname, '.husky');

  if (!fs.existsSync(huskyDir)) {
    console.error('⚠️  Las dependencias necesarias no están instaladas.');
    process.exit(1);
  }
}

function readStateFile() {
  return fs.existsSync(stateFilePath)
    ? fs.readFileSync(stateFilePath, 'utf-8').trim()
    : 'disabled';
}

function writeStateFile(state) {
  fs.writeFileSync(stateFilePath, state, 'utf-8');
}

function printCommitGuide() {
  console.log('Guía de commits');
}

function printCommitError() {
  console.error('⛔️ Error: Mensaje de commit inválido.');
}

function validateCommitMessage(commitMessagePath) {
  try {
    const commitMessage = fs.readFileSync(commitMessagePath, 'utf-8').trim();

    if (!semanticRegex.test(commitMessage)) {
      printCommitError();
      process.exit(1);
    }

    console.log('✅ Mensaje de commit válido.');
  } catch (err) {
    console.error('❌ Error durante la validación:', err);
    process.exit(1);
  }
}

function handleStateChange(state) {
  writeStateFile(state);
  console.log(`Validación ${state}`);
  if (state === 'enable') printCommitGuide();
  process.exit(0);
}

function main(args = process.argv.slice(2)) {
  checkDependencies();

  const estado = readStateFile();

  if (args[0] === 'enable' || args[0] === 'disabled') {
    return handleStateChange(args[0]);
  }

  if (estado === 'enable') {
    validateCommitMessage(args[0]);
  } else {
    console.log('Validación deshabilitada');
  }

  process.exit(0);
}

export {
  main,
  validateCommitMessage,
  readStateFile,
  writeStateFile
};

// entrypoint limpio
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}