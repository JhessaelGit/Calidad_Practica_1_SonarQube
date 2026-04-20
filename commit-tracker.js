import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const DATA_FILE = 'commit-history.json';
const GIT = '/usr/bin/git';
const NPX = '/usr/bin/npx';
const NPM = '/usr/bin/npm';

// 🔹 BASIC INFO
function getBasicInfo(sha) {
  return {
    message: execFileSync(GIT, ['log', '-1', '--pretty=%B', sha]).toString().trim(),
    date: new Date(execFileSync(GIT, ['log', '-1', '--format=%cd', sha]).toString()).toISOString(),
    author: execFileSync(GIT, ['log', '-1', '--pretty=format:%an', sha]).toString().trim()
  };
}

// 🔹 REPO URL
function getRepoUrl() {
  try {
    let url = execFileSync(GIT, ['config', '--get', 'remote.origin.url'])
      .toString()
      .trim()
      .replace(/\.git$/, '');

    if (url.startsWith('git@')) {
      url = url.replace(/^git@([^:]+):(.+)$/, 'https://$1/$2');
    }

    return url;
  } catch {
    return '';
  }
}

// 🔹 STATS
function getStats(sha, isFirstCommit) {
  let additions = 0;
  let deletions = 0;

  try {
    const diff = isFirstCommit
      ? execFileSync(GIT, ['diff', '--stat', sha]).toString()
      : execFileSync(GIT, ['diff', '--stat', `${sha}~1`, sha]).toString();

    const parts = diff.split(',');

    const insertionPart = parts.find(p => p.includes('insertion')) || '';
    const deletionPart = parts.find(p => p.includes('deletion')) || '';

    additions = Number.parseInt(insertionPart) || 0;
    deletions = Number.parseInt(deletionPart) || 0;
  } catch {}

  return { additions, deletions };
}

// 🔹 TEST DATA
function getTestData() {
  let testCount = 0;
  let coverage = 0;

  if (!fs.existsSync('package.json')) return { testCount, coverage };

  try {
    const jestOutput = execFileSync(NPX, ['jest', '--json'], { stdio: 'pipe' }).toString();

    try {
      testCount = JSON.parse(jestOutput).numTotalTests;
    } catch {
      const match = /numTotalTests['"]\s*:\s*(\d+)/.exec(jestOutput);
      if (match) testCount = Number.parseInt(match[1]);
    }

    const coverageOutput = execFileSync(NPM, ['test', '--', '--coverage'], { stdio: 'pipe' }).toString();

    const match = /All files\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*(\d+(\.\d+)?)\s*\|/.exec(coverageOutput);

    if (match) coverage = Number.parseFloat(match[1]);
  } catch {}

  return { testCount, coverage };
}

// 🔹 MAIN OBJECT
function getCommitInfo(sha, isFirstCommit) {
  try {
    const basic = getBasicInfo(sha);
    const repoUrl = getRepoUrl();
    const stats = getStats(sha, isFirstCommit);
    const testData = getTestData();

    return {
      sha,
      author: basic.author,
      commit: {
        date: basic.date,
        message: basic.message,
        url: repoUrl ? `${repoUrl}/commit/${sha}` : ''
      },
      stats: {
        total: stats.additions + stats.deletions,
        additions: stats.additions,
        deletions: stats.deletions,
        date: basic.date.split('T')[0]
      },
      coverage: testData.coverage,
      test_count: testData.testCount
    };
  } catch {
    return null;
  }
}

// 🔹 DUPLICATE
function isDuplicate(newCommit, existingCommits) {
  return existingCommits.some(commit =>
    commit.commit.message === newCommit.commit.message &&
    commit.stats.additions === newCommit.stats.additions &&
    commit.stats.deletions === newCommit.stats.deletions &&
    commit.test_count === newCommit.test_count &&
    new Date(newCommit.commit.date) >= new Date(commit.commit.date)
  );
}

// 🔹 SAVE
function saveCommitData(commitData) {
  let commits = [];

  if (fs.existsSync(DATA_FILE)) {
    try {
      commits = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      commits = [];
    }
  }

  const index = commits.findIndex(c => c.sha === commitData.sha);

  if (index >= 0) {
    commits[index] = commitData;
  } else if (!isDuplicate(commitData, commits)) {
    commits.push(commitData);
  }

  commits.sort((a, b) => new Date(a.commit.date) - new Date(b.commit.date));

  fs.writeFileSync(DATA_FILE, JSON.stringify(commits, null, 2));
}

// 🔹 MAIN
function main() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }

    const sha = execFileSync(GIT, ['rev-parse', 'HEAD']).toString().trim();
    const isFirst = execFileSync(GIT, ['rev-list', '--count', 'HEAD']).toString().trim() === '1';

    const data = getCommitInfo(sha, isFirst);

    if (data) saveCommitData(data);
  } catch {
    process.exit(1);
  }
}

export {
  main,
  getCommitInfo,
  getStats,
  getTestData,
  isDuplicate,
  saveCommitData,
  getBasicInfo,   // 🔥 AGREGAR
  getRepoUrl      // 🔥 AGREGAR
};

if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
}