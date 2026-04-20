import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const GIT = '/usr/bin/git';

// 🔹 obtiene ID del último commit
const getLatestCommitId = () => {
    return execFileSync(GIT, ['rev-parse', 'HEAD']).toString().trim();
};

// 🔹 obtiene mensaje del último commit
const getLatestCommitName = () => {
    return execFileSync(GIT, ['log', '-1', '--pretty=%B']).toString().trim();
};

// 🔹 lógica principal (testeable)
const updateJsonFile = (commitId, commitName, filePath) => {
    const commitTimestamp = Date.now();
    const data = { commitId, commitName, commitTimestamp };

    try {
        const fileData = fs.readFileSync(filePath, 'utf8');
        const existingData = JSON.parse(fileData);
        existingData.push(data);
        fs.writeFileSync(filePath, JSON.stringify(existingData, null, 2));
    } catch (err) {
        if (err.code === 'ENOENT') {
            fs.writeFileSync(filePath, JSON.stringify([data], null, 2));
        } else {
            console.error('Error updating JSON file:', err);
        }
    }
};

// 🔹 entrypoint separado (clave para coverage)
const main = () => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'tdd_log.json');

    const latestCommitId = getLatestCommitId();
    const latestCommitName = getLatestCommitName();

    updateJsonFile(latestCommitId, latestCommitName, filePath);
};

// 🔹 exports para testing
export {
    updateJsonFile,
    getLatestCommitId,
    getLatestCommitName,
    main
};

/* istanbul ignore next */
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    main();
}