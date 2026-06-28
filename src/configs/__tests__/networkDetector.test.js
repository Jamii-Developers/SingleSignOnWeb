import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => { store[key] = value; }),
        removeItem: vi.fn(key => { delete store[key]; }),
        clear: () => { store = {}; },
    };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('NetworkDetector', () => {
    let Conn;
    let NetworkDetector;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        localStorageMock.clear();
        vi.useFakeTimers();

        // Import fresh instances after reset so they share the same module graph
        const connMod = await import('../conn');
        Conn = connMod.default;
        Conn.setServer(null);

        const ndMod = await import('../networkDetector');
        NetworkDetector = ndMod.default;
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('connects to first available server when no cache exists', async () => {
        mockFetch.mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(Conn.getServer()).toBe(Conn.SERVERS[0]);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
            'selectedServer',
            expect.stringContaining(Conn.SERVERS[0])
        );
    });

    it('falls back to second server when first is unavailable', async () => {
        mockFetch
            .mockResolvedValueOnce({ ok: false })
            .mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(Conn.getServer()).toBe(Conn.SERVERS[1]);
    });

    it('throws when no servers are available', async () => {
        mockFetch.mockResolvedValue({ ok: false });

        await expect(NetworkDetector()).rejects.toThrow('No servers are available');
    });

    it('uses cached server when cache is valid and server responds', async () => {
        const cachedUrl = 'http://cached-server.com/';
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            url: cachedUrl,
            timestamp: Date.now()
        }));
        mockFetch.mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(Conn.getServer()).toBe(cachedUrl);
    });

    it('clears cache and tries all servers when cached server fails', async () => {
        const cachedUrl = 'http://dead-server.com/';
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            url: cachedUrl,
            timestamp: Date.now()
        }));
        // Cached server fails, first real server succeeds
        mockFetch
            .mockResolvedValueOnce({ ok: false })
            .mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('selectedServer');
        expect(Conn.getServer()).toBe(Conn.SERVERS[0]);
    });

    it('clears expired cache and tries all servers', async () => {
        const cachedUrl = 'http://old-server.com/';
        const expiredTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
        localStorageMock.getItem.mockReturnValue(JSON.stringify({
            url: cachedUrl,
            timestamp: expiredTimestamp
        }));
        mockFetch.mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('selectedServer');
        expect(Conn.getServer()).toBe(Conn.SERVERS[0]);
    });

    it('handles corrupt cache gracefully', async () => {
        localStorageMock.getItem.mockReturnValue('not-valid-json{{{');
        mockFetch.mockResolvedValueOnce({ ok: true });

        await NetworkDetector();

        expect(localStorageMock.removeItem).toHaveBeenCalledWith('selectedServer');
        expect(Conn.getServer()).toBe(Conn.SERVERS[0]);
    });

    it('handles fetch throwing an error (network down)', async () => {
        mockFetch.mockRejectedValue(new Error('Network error'));

        await expect(NetworkDetector()).rejects.toThrow('No servers are available');
    });
});
