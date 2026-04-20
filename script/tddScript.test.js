import { jest } from '@jest/globals';

// 🔥 mocks
const fsMock = {
  readFileSync: jest.fn(),
  writeFileSync: jest.fn(),
  existsSync: jest.fn(),
};

const spawnMock = jest.fn();

// 🔥 mock módulos
jest.unstable_mockModule('node:fs', () => ({
  default: fsMock,
}));

jest.unstable_mockModule('cross-spawn', () => ({
  spawn: spawnMock,
}));

// ⚠️ importar después
const { extractAndAddObject } = await import('../script/tddScript.js');

describe('reportScript', () => {

  const reportFile = '/fake/report.json';
  const tddLogFile = '/fake/tdd_log.json';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ✅ TC1 - flujo completo correcto
  test('agrega nuevo reporte al log', async () => {
    const fakeProcess = {
      on: (event, cb) => {
        if (event === 'close') cb(0);
      }
    };

    spawnMock.mockReturnValue(fakeProcess);

    fsMock.existsSync.mockReturnValue(true);

    fsMock.readFileSync
      .mockReturnValueOnce(JSON.stringify({
        numPassedTests: 5,
        numFailedTests: 1,
        numTotalTests: 6,
        startTime: 123,
        success: false
      }))
      .mockReturnValueOnce(JSON.stringify([]));

    await extractAndAddObject(reportFile, tddLogFile);

    expect(fsMock.writeFileSync).toHaveBeenCalled();

    const written = JSON.parse(fsMock.writeFileSync.mock.calls[0][1]);

    expect(written.length).toBe(1);
    expect(written[0].numPassedTests).toBe(5);
  });

  // ✅ TC2 - crea archivo si no existe
  test('crea tdd_log si no existe', async () => {
    const fakeProcess = {
      on: (event, cb) => {
        if (event === 'close') cb(0);
      }
    };

    spawnMock.mockReturnValue(fakeProcess);

    fsMock.existsSync.mockReturnValue(false);

    fsMock.readFileSync
      .mockReturnValueOnce(JSON.stringify({
        numPassedTests: 2,
        numFailedTests: 0,
        numTotalTests: 2,
        startTime: 111,
        success: true
      }))
      .mockReturnValueOnce(JSON.stringify([]));

    await extractAndAddObject(reportFile, tddLogFile);

    expect(fsMock.writeFileSync).toHaveBeenCalled();
  });

  // ❌ TC3 - error en ejecución
  test('maneja error en ejecución', async () => {
    const fakeProcess = {
      on: (event, cb) => {
        if (event === 'close') cb(0);
      }
    };

    spawnMock.mockReturnValue(fakeProcess);

    fsMock.readFileSync.mockImplementation(() => {
      throw new Error('fail');
    });

    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await extractAndAddObject(reportFile, tddLogFile);

    expect(spy).toHaveBeenCalled();

    spy.mockRestore();
  });
 test('agrega sobre log existente', async () => {
  const fakeProcess = {
    on: (event, cb) => event === 'close' && cb(0)
  };

  spawnMock.mockReturnValue(fakeProcess);

  fsMock.existsSync.mockReturnValue(true);

  fsMock.readFileSync
    .mockReturnValueOnce(JSON.stringify({
      numPassedTests: 1,
      numFailedTests: 0,
      numTotalTests: 1,
      startTime: 1,
      success: true
    }))
    .mockReturnValueOnce(JSON.stringify([{ old: true }]));

  await extractAndAddObject(reportFile, tddLogFile);

  const written = JSON.parse(fsMock.writeFileSync.mock.calls[0][1]);

  expect(written.length).toBe(2);
});
test('agrega sobre log existente', async () => {
    const fakeProcess = {
      on: (event, cb) => event === 'close' && cb(0)
    };
  
    spawnMock.mockReturnValue(fakeProcess);
  
    fsMock.existsSync.mockReturnValue(true);
  
    fsMock.readFileSync
      .mockReturnValueOnce(JSON.stringify({
        numPassedTests: 1,
        numFailedTests: 0,
        numTotalTests: 1,
        startTime: 1,
        success: true
      }))
      .mockReturnValueOnce(JSON.stringify([{ old: true }]));
  
    await extractAndAddObject(reportFile, tddLogFile);
  
    const written = JSON.parse(fsMock.writeFileSync.mock.calls[0][1]);
  
    expect(written.length).toBe(2);
  });

  test('maneja error en runCommand', async () => {
    spawnMock.mockImplementation(() => {
      throw new Error('spawn fail');
    });
  
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    await extractAndAddObject(reportFile, tddLogFile);
  
    expect(spy).toHaveBeenCalled();
  
    spy.mockRestore();
  });

  test('maneja distintos valores de reporte', async () => {
    const fakeProcess = {
      on: (event, cb) => event === 'close' && cb(0)
    };
  
    spawnMock.mockReturnValue(fakeProcess);
  
    fsMock.existsSync.mockReturnValue(true);
  
    fsMock.readFileSync
      .mockReturnValueOnce(JSON.stringify({
        numPassedTests: 0,
        numFailedTests: 5,
        numTotalTests: 5,
        startTime: 999,
        success: false
      }))
      .mockReturnValueOnce(JSON.stringify([]));
  
    await extractAndAddObject(reportFile, tddLogFile);
  
    const written = JSON.parse(fsMock.writeFileSync.mock.calls[0][1]);
  
    expect(written[0].success).toBe(false);
  });

  test('maneja error en runCommand', async () => {
    const fakeProcess = {
      on: (event, cb) => {
        if (event === 'close') cb(1); // código de error
      }
    };
  
    spawnMock.mockReturnValue(fakeProcess);
  
    // fuerza error después
    fsMock.readFileSync.mockImplementation(() => {
      throw new Error('fail');
    });
  
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    await extractAndAddObject(reportFile, tddLogFile);
  
    expect(spy).toHaveBeenCalled();
  
    spy.mockRestore();
  });

  test('no crea archivo si ya existe', async () => {
    const fakeProcess = {
      on: (event, cb) => event === 'close' && cb(0)
    };
  
    spawnMock.mockReturnValue(fakeProcess);
  
    fsMock.existsSync.mockReturnValue(true);
  
    fsMock.readFileSync
      .mockReturnValueOnce(JSON.stringify({
        numPassedTests: 1,
        numFailedTests: 0,
        numTotalTests: 1,
        startTime: 1,
        success: true
      }))
      .mockReturnValueOnce(JSON.stringify([]));
  
    await extractAndAddObject(reportFile, tddLogFile);
  
    // 🔥 importante: NO se llama writeJSONFile en ensureFileExists
    expect(fsMock.writeFileSync).toHaveBeenCalledTimes(1);
  });
 
  


});