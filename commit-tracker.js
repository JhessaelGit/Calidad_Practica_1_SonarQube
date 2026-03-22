import fs from 'node:fs';
import { execSync } from 'node:child_process';

const DATA_FILE = 'commit-history.json';

function getBasicInfo(sha) {
  return {
    message: execSync(`git log -1 --pretty=%B ${sha}`).toString().trim(),
    date: new Date(execSync(`git log -1 --format=%cd ${sha}`).toString()).toISOString(),
    author: execSync(`git log -1 --pretty=format:%an ${sha}`).toString().trim()
  };
}

function getRepoUrl() {
  try {
    let url = execSync('git config --get remote.origin.url')
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

function getStats(sha, isFirstCommit) {
  let additions = 0;
  let deletions = 0;

  try {
    if (isFirstCommit) {
      const diff = execSync(`git diff --stat ${sha}`).toString();
      additions = Number.parseInt(diff.match(/(\d+) insertion/)?.[1]) || 0;
    } else {
      const diff = execSync(`git diff --stat ${sha}~1 ${sha}`).toString();
      additions = Number.parseInt(diff.match(/(\d+) insertion/)?.[1]) || 0;
      deletions = Number.parseInt(diff.match(/(\d+) deletion/)?.[1]) || 0;
    }
  } catch {}

  return { additions, deletions };
}

function getTestAndCoverage() {
  let testCount = 0;
  let coverage = 0;

  if (!fs.existsSync('package.json')) return { testCount, coverage };

  try {
    const jestOutput = execSync('npx jest --json', { stdio: 'pipe' }).toString();

    try {
      const jestResults = JSON.parse(jestOutput);
      testCount = jestResults.numTotalTests;
    } catch {
      const match = jestOutput.match(/numTotalTests['"]\s*:\s*(\d+)/);
      if (match) testCount = Number.parseInt(match[1]);
    }

    const coverageOutput = execSync('npm test -- --coverage --verbose', { stdio: 'pipe' }).toString();
    const coverageMatch = coverageOutput.match(/All files\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*\d+\s*\|\s*(\d+(\.\d+)?)\s*\|/);

    if (coverageMatch) {
      coverage = Number.parseFloat(coverageMatch[1]);
    }
  } catch {}

  return { testCount, coverage };
}

function getCommitInfo(sha, isFirstCommit) {
  try {
    const basic = getBasicInfo(sha);
    const repoUrl = getRepoUrl();
    const { additions, deletions } = getStats(sha, isFirstCommit);
    const { testCount, coverage } = getTestAndCoverage();

    return {
      sha,
      author: basic.author,
      commit: {
        date: basic.date,
        message: basic.message,
        url: repoUrl ? `${repoUrl}/commit/${sha}` : ''
      },
      stats: {
        total: additions + deletions,
        additions,
        deletions,
        date: basic.date.split('T')[0]
      },
      coverage,
      test_count: testCount
    };
  } catch (error) {
    console.error(`Error en commit ${sha}:`, error);
    return null;
  }
}


function isDuplicate(newCommit, existingCommits) {
  for (const commit of existingCommits) {
    if (
      commit.commit.message === newCommit.commit.message &&
      commit.stats.additions === newCommit.stats.additions &&
      commit.stats.deletions === newCommit.stats.deletions &&
      commit.test_count === newCommit.test_count
    ) {
      const existingDate = new Date(commit.commit.date);
      const newDate = new Date(newCommit.commit.date);

      if (newDate >= existingDate) {
        console.log(`Detectado commit duplicado (${newCommit.sha}), se mantiene el más antiguo (${commit.sha})`);
        return true;
      }
    }
  }
  return false;
}

function saveCommitData(commitData) {
  let commits = [];

  if (fs.existsSync(DATA_FILE)) {
    try {
      commits = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch {
      commits = [];
    }
  }

  const existingIndex = commits.findIndex(c => c.sha === commitData.sha);

  if (existingIndex >= 0) {
    commits[existingIndex] = commitData;
  } else if (!isDuplicate(commitData, commits)) {
    commits.push(commitData);
  }

  if (commitData.commit.url) {
    commits.forEach(commit => {
      if (!commit.commit.url) {
        commit.commit.url = commitData.commit.url.replace(/\/commit\/[^/]+$/, `/commit/${commit.sha}`);
      }
    });
  }

  commits.sort((a, b) => new Date(a.commit.date) - new Date(b.commit.date));

  fs.writeFileSync(DATA_FILE, JSON.stringify(commits, null, 2));
}


try {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }

  const currentSha = execSync('git rev-parse HEAD').toString().trim();
  const isFirstCommit = execSync('git rev-list --count HEAD').toString().trim() === '1';

  const commitData = getCommitInfo(currentSha, isFirstCommit);

  if (commitData) {
    saveCommitData(commitData);
  }
} catch (error) {
  console.error('Error en el script:', error);
  process.exit(1);
}