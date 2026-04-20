import { jest } from '@jest/globals';

// 🔥 mocks
const fsMock = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

const execMock = jest.fn();

jest.unstable_mockModule('node:fs', () => ({
  default: fsMock,
}));

jest.unstable_mockModule('node:child_process', () => ({
  execFileSync: execMock,
}));

// importar después de mocks
const {
  getCommitInfo,
  getStats,
  getTestData,
  isDuplicate,
  saveCommitData
} = await import('./commit-tracker.js');

describe('commit-tracker', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TC1 – getStats normal
  test('getStats calcula inserciones y eliminaciones', () => {
    execMock.mockReturnValue(' 2 files changed, 10 insertions(+), 5 deletions(-)');

    const result = getStats('sha', false);

    expect(result.additions).toBe(10);
    expect(result.deletions).toBe(5);
  });

  // ✅ TC2 – getStats primer commit
  test('getStats primer commit', () => {
    execMock.mockReturnValue(' 1 file changed, 3 insertions(+)');

    const result = getStats('sha', true);

    expect(result.additions).toBe(3);
    expect(result.deletions).toBe(0);
  });

  // ❌ TC3 – getStats error
  test('getStats maneja error', () => {
    execMock.mockImplementation(() => { throw new Error(); });

    const result = getStats('sha', false);

    expect(result).toEqual({ additions: 0, deletions: 0 });
  });

  // ✅ TC4 – getTestData sin package.json
  test('getTestData sin package.json', () => {
    fsMock.existsSync.mockReturnValue(false);

    const result = getTestData();

    expect(result).toEqual({ testCount: 0, coverage: 0 });
  });

  // ✅ TC5 – getTestData con datos
  test('getTestData parsea datos', () => {
    fsMock.existsSync.mockReturnValue(true);

    execMock
      .mockReturnValueOnce(JSON.stringify({ numTotalTests: 20 }))
      .mockReturnValueOnce('All files | 100 | 100 | 100 | 95 |');

    const result = getTestData();

    expect(result.testCount).toBe(20);
    expect(result.coverage).toBe(95);
  });

  // ❌ TC6 – getTestData error
  test('getTestData maneja error', () => {
    fsMock.existsSync.mockReturnValue(true);

    execMock.mockImplementation(() => { throw new Error(); });

    const result = getTestData();

    expect(result).toEqual({ testCount: 0, coverage: 0 });
  });

  // ✅ TC7 – isDuplicate verdadero
  test('detecta duplicado', () => {
    const newCommit = {
      commit: { message: 'msg', date: '2024-01-01' },
      stats: { additions: 1, deletions: 1 },
      test_count: 5
    };

    const existing = [{
      commit: { message: 'msg', date: '2023-01-01' },
      stats: { additions: 1, deletions: 1 },
      test_count: 5
    }];

    expect(isDuplicate(newCommit, existing)).toBe(true);
  });

  // ✅ TC8 – isDuplicate falso
  test('no detecta duplicado', () => {
    const newCommit = {
      commit: { message: 'msg2', date: '2024-01-01' },
      stats: { additions: 1, deletions: 1 },
      test_count: 5
    };

    expect(isDuplicate(newCommit, [])).toBe(false);
  });

  // ✅ TC9 – saveCommitData agrega commit
  test('saveCommitData agrega commit nuevo', () => {
    fsMock.existsSync.mockReturnValue(false);

    const commit = {
      sha: 'abc',
      commit: { date: '2024-01-01', message: 'msg', url: '' },
      stats: { additions: 1, deletions: 1 },
      test_count: 1
    };

    saveCommitData(commit);

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  // ✅ TC10 – saveCommitData reemplaza commit existente
  test('saveCommitData reemplaza commit existente', () => {
    fsMock.existsSync.mockReturnValue(true);

    fsMock.readFileSync.mockReturnValue(JSON.stringify([
      { sha: 'abc', commit: { date: '2024-01-01' }, stats: {}, test_count: 1 }
    ]));

    const commit = {
      sha: 'abc',
      commit: { date: '2024-02-01', message: 'msg', url: '' },
      stats: { additions: 1, deletions: 1 },
      test_count: 1
    };

    saveCommitData(commit);

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  // ❌ TC11 – JSON corrupto
  test('maneja JSON corrupto', () => {
    fsMock.existsSync.mockReturnValue(true);

    fsMock.readFileSync.mockImplementation(() => {
      throw new Error();
    });

    const commit = {
      sha: 'abc',
      commit: { date: '2024-01-01', message: 'msg', url: '' },
      stats: { additions: 1, deletions: 1 },
      test_count: 1
    };

    saveCommitData(commit);

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  test('getBasicInfo retorna datos correctos', async () => {
    execMock
      .mockReturnValueOnce('mensaje\n')
      .mockReturnValueOnce('2024-01-01')
      .mockReturnValueOnce('autor\n');
  
    const { getBasicInfo } = await import('./commit-tracker.js');
  
    const result = getBasicInfo('sha');
  
    expect(result.message).toBe('mensaje');
    expect(result.author).toBe('autor');
  });

  test('getRepoUrl normaliza URL https', async () => {
    execMock.mockReturnValue('https://github.com/user/repo.git\n');
  
    const { getRepoUrl } = await import('./commit-tracker.js');
  
    const result = getRepoUrl();
  
    expect(result).toBe('https://github.com/user/repo');
  });

  test('getRepoUrl convierte ssh a https', async () => {
    execMock.mockReturnValue('git@github.com:user/repo.git\n');
  
    const { getRepoUrl } = await import('./commit-tracker.js');
  
    const result = getRepoUrl();
  
    expect(result).toBe('https://github.com/user/repo');
  });

  test('getRepoUrl maneja error', async () => {
    execMock.mockImplementation(() => { throw new Error(); });
  
    const { getRepoUrl } = await import('./commit-tracker.js');
  
    const result = getRepoUrl();
  
    expect(result).toBe('');
  });

  test('getCommitInfo construye objeto completo', async () => {
    execMock
      // basic info
      .mockReturnValueOnce('msg\n')
      .mockReturnValueOnce('2024-01-01')
      .mockReturnValueOnce('autor\n')
      // repo url
      .mockReturnValueOnce('https://repo.git\n')
      // stats
      .mockReturnValueOnce('1 file changed, 2 insertions(+), 1 deletions(-)')
      // jest
      .mockReturnValueOnce(JSON.stringify({ numTotalTests: 10 }))
      // coverage
      .mockReturnValueOnce('All files | 100 | 100 | 100 | 90 |');
  
    fsMock.existsSync.mockReturnValue(true);
  
    const { getCommitInfo } = await import('./commit-tracker.js');
  
    const result = getCommitInfo('sha', false);
  
    expect(result).not.toBeNull();
    expect(result.sha).toBe('sha');
  });

  test('getCommitInfo retorna null en error', async () => {
    execMock.mockImplementation(() => { throw new Error(); });
  
    const { getCommitInfo } = await import('./commit-tracker.js');
  
    const result = getCommitInfo('sha', false);
  
    expect(result).toBeNull();
  });

  test('main ejecuta flujo completo', async () => {
    fsMock.existsSync.mockReturnValue(false);
  
    execMock
      .mockReturnValueOnce('sha\n')
      .mockReturnValueOnce('1')
      .mockReturnValue('dummy');
  
    const { main } = await import('./commit-tracker.js');
  
    main();
  
    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });
});