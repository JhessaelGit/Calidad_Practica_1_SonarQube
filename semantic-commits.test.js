import { jest } from '@jest/globals';

// mocks
const fsMock = {
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
};

jest.unstable_mockModule('node:fs', () => ({
  default: fsMock,
}));

const consoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const exitMock = jest.spyOn(process, 'exit').mockImplementation(() => {});

// import después de mocks
const {
  main,
  validateCommitMessage,
  readStateFile,
  writeStateFile
} = await import('./semantic-commits.js');

describe('semantic commits', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TC1
  test('readStateFile retorna disabled si no existe', () => {
    fsMock.existsSync.mockReturnValue(false);

    const result = readStateFile();

    expect(result).toBe('disabled');
  });

  // ✅ TC2
  test('writeStateFile escribe estado', () => {
    writeStateFile('enable');

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  // ✅ TC3
  test('commit válido', () => {
    fsMock.readFileSync.mockReturnValue('feat: nuevo');

    validateCommitMessage('file.txt');

    expect(consoleLog).toHaveBeenCalled();
  });

  // ❌ TC4
  test('commit inválido', () => {
    fsMock.readFileSync.mockReturnValue('mal mensaje');

    validateCommitMessage('file.txt');

    expect(consoleError).toHaveBeenCalled();
    expect(exitMock).toHaveBeenCalledWith(1);
  });

  // ❌ TC5
  test('error leyendo commit', () => {
    fsMock.readFileSync.mockImplementation(() => {
      throw new Error();
    });

    validateCommitMessage('file.txt');

    expect(consoleError).toHaveBeenCalled();

    // 🔥 restaurar para no romper otros tests
    fsMock.readFileSync.mockReset();
  });

  // ✅ TC6
  test('main con enable', () => {
    fsMock.existsSync.mockReturnValue(true);

    // 🔥 IMPORTANTE: evitar undefined.trim()
    fsMock.readFileSync.mockReturnValue('disabled');

    main(['enable']);

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  // ✅ TC7
  test('main con validación activa', () => {
    fsMock.existsSync.mockReturnValue(true);

    fsMock.readFileSync
      .mockReturnValueOnce('enable') // estado
      .mockReturnValueOnce('feat: ok'); // commit

    main(['file.txt']);

    expect(consoleLog).toHaveBeenCalled();
  });

  // ✅ TC8
  test('main deshabilitado', () => {
    fsMock.existsSync.mockReturnValue(true);

    fsMock.readFileSync.mockReturnValue('disabled');

    main(['file.txt']);

    expect(consoleLog).toHaveBeenCalledWith('Validación deshabilitada');
  });

});