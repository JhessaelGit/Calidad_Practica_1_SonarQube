import { jest } from '@jest/globals';

// 🔥 mocks
const fsMock = {
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

const childProcessMock = {
  execFileSync: jest.fn(),
};

// 🔥 mock de módulos ESM
jest.unstable_mockModule('node:fs', () => ({
  default: fsMock,
}));

jest.unstable_mockModule('node:child_process', () => ({
  execFileSync: childProcessMock.execFileSync,
}));

// ⚠️ IMPORTANTE: importar después de los mocks
let module;
let updateJsonFile;
let getLatestCommitId;
let getLatestCommitName;
let main;

beforeAll(async () => {
  module = await import('../script/commitScript.js');

  updateJsonFile = module.updateJsonFile;
  getLatestCommitId = module.getLatestCommitId;
  getLatestCommitName = module.getLatestCommitName;
  main = module.main;
});

const fs = fsMock;

describe('commitScript FULL coverage', () => {

  const filePath = '/fake/tdd_log.json';

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, 'now').mockReturnValue(1234567890);
  });

  // ✅ TC1
  test('append cuando archivo existe', () => {
    fs.readFileSync.mockReturnValue(JSON.stringify([]));

    updateJsonFile('1', 'test', filePath);

    expect(fs.writeFileSync).toHaveBeenCalled();

    const writtenData = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(writtenData.length).toBe(1);
  });

  // ✅ TC2
  test('crea archivo si no existe (ENOENT)', () => {
    const error = new Error();
    error.code = 'ENOENT';

    fs.readFileSync.mockImplementation(() => { throw error; });

    updateJsonFile('1', 'test', filePath);

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  // ✅ TC3
  test('error distinto (console.error)', () => {
    const error = new Error();
    error.code = 'EACCES';

    fs.readFileSync.mockImplementation(() => { throw error; });

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    updateJsonFile('1', 'test', filePath);

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });

  // ✅ TC4
  test('getLatestCommitId', () => {
    childProcessMock.execFileSync.mockReturnValue('abc123\n');

    const result = getLatestCommitId();

    expect(result).toBe('abc123');
  });

  // ✅ TC5
  test('getLatestCommitName', () => {
    childProcessMock.execFileSync.mockReturnValue('mensaje commit\n');

    const result = getLatestCommitName();

    expect(result).toBe('mensaje commit');
  });

  // ✅ TC6
  test('main ejecuta flujo completo', () => {
    childProcessMock.execFileSync
      .mockReturnValueOnce('abc123\n')
      .mockReturnValueOnce('mensaje\n');

    fs.readFileSync.mockReturnValue(JSON.stringify([]));

    main();

    expect(fs.writeFileSync).toHaveBeenCalled();
  });

  // ✅ TC7 (EL QUE TE FALTABA 🔥)
  test('no ejecuta main cuando no es entrypoint', async () => {
    jest.resetModules();

    const originalArgv = process.argv;
    process.argv = ['node', 'otroArchivo.js'];

    const fsMock2 = {
      readFileSync: jest.fn(),
      writeFileSync: jest.fn(),
    };

    const childProcessMock2 = {
      execFileSync: jest.fn(),
    };

    jest.unstable_mockModule('node:fs', () => ({
      default: fsMock2,
    }));

    jest.unstable_mockModule('node:child_process', () => ({
      execFileSync: childProcessMock2.execFileSync,
    }));

    await import('../script/commitScript.js');

    expect(fsMock2.writeFileSync).not.toHaveBeenCalled();

    process.argv = originalArgv;
  });

});