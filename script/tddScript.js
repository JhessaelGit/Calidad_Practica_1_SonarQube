import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'cross-spawn';

const COMMAND = 'jest';
const args = ['--json', '--outputFile=./script/report.json'];

// 🔹 ejecuta comando externo (async)

function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, { stdio: 'inherit' });

    process.on('close', (code) => {
      resolve();
    });
  });
}

// 🔹 lee JSON
const readJSONFile = (filePath) => {
  const rawData = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(rawData);
};

// 🔹 escribe JSON
const writeJSONFile = (filePath, data) => {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFileSync(filePath, jsonString, 'utf-8');
};

// 🔹 asegura existencia de archivo
const ensureFileExists = (filePath, initialData) => {
  if (!fs.existsSync(filePath)) {
    writeJSONFile(filePath, initialData);
  }
};

// 🔹 lógica principal
const extractAndAddObject = async (reportFile, tddLogFile) => {
  try {
    await runCommand(COMMAND, args);

    ensureFileExists(tddLogFile, []);

    const jsonData = readJSONFile(reportFile);

    const newReport = {
      numPassedTests: jsonData.numPassedTests,
      failedTests: jsonData.numFailedTests,
      numTotalTests: jsonData.numTotalTests,
      timestamp: jsonData.startTime,
      success: jsonData.success
    };

    const tddLog = readJSONFile(tddLogFile);
    tddLog.push(newReport);

    writeJSONFile(tddLogFile, tddLog);

  } catch (error) {
    console.error("Error en la ejecución:", error);
  }
};

// 🔹 entrypoint separado (clave para test y coverage)
const main = () => {
  /* istanbul ignore next */
  const __filename = fileURLToPath(import.meta.url);
  /* istanbul ignore next */
  const __dirname = path.dirname(__filename);
/* istanbul ignore next */
  const inputFilePath = path.join(__dirname, 'report.json');
  /* istanbul ignore next */
  const outputFilePath = path.join(__dirname, 'tdd_log.json');
/* istanbul ignore next */
  extractAndAddObject(inputFilePath, outputFilePath);
};

// 🔹 exports
export {
  extractAndAddObject,
  main
};

// 🔹 ejecución solo como script
/* istanbul ignore next */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}