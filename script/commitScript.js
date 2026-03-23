import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import path from 'node:path';

const GIT = '/usr/bin/git';

const getLatestCommitId = () => {
    return execFileSync(GIT, ['rev-parse', 'HEAD']).toString().trim();
};

const getLatestCommitName = () => {
    return execFileSync(GIT, ['log', '-1', '--pretty=%B']).toString().trim();
};

const updateJsonFile = (commitId, commitName) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const filePath = path.join(__dirname, 'tdd_log.json');
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

const latestCommitId = getLatestCommitId();
const latestCommitName = getLatestCommitName();
updateJsonFile(latestCommitId, latestCommitName);