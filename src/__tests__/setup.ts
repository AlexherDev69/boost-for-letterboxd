import { vi } from 'vitest';

const storageData: Record<string, unknown> = {};

const chromeMock = {
  contextMenus: {
    create: vi.fn(),
    removeAll: vi.fn(),
    onClicked: {
      addListener: vi.fn(),
    },
  },
  tabs: {
    create: vi.fn(),
  },
  runtime: {
    onInstalled: {
      addListener: vi.fn(),
    },
    onMessage: {
      addListener: vi.fn(),
    },
    sendMessage: vi.fn(),
    getURL: vi.fn((path: string) => `chrome-extension://mock-id/${path}`),
    getManifest: vi.fn(() => ({ version: '1.0.0' })),
  },
  storage: {
    sync: {
      get: vi.fn((defaults: Record<string, unknown>) => {
        const result: Record<string, unknown> = {};
        for (const key of Object.keys(defaults)) {
          result[key] = key in storageData ? storageData[key] : defaults[key];
        }
        return Promise.resolve(result);
      }),
      set: vi.fn((items: Record<string, unknown>) => {
        Object.assign(storageData, items);
        return Promise.resolve();
      }),
    },
  },
};

/** Clear the in-memory storage mock between tests. */
export function clearStorageMock(): void {
  for (const key of Object.keys(storageData)) {
    delete storageData[key];
  }
}

Object.defineProperty(globalThis, 'chrome', {
  value: chromeMock,
  writable: true,
});
