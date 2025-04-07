jest.mock('fs/promises', () => ({
    ...jest.requireActual('fs/promises'),
    rm: jest.fn().mockResolvedValue(undefined), // Mock `rm` to prevent file deletion errors
    stat: jest.fn().mockResolvedValue({ size: 1024 }), // Mock `stat` for file size checks
  }));