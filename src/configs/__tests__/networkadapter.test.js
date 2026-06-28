import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('JsonNetworkAdapter', () => {
    let JsonNetworkAdapter;

    beforeEach(async () => {
        vi.resetModules();
        vi.clearAllMocks();
        const mod = await import('../networkadapter');
        JsonNetworkAdapter = mod.default;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('makes a POST request with correct parameters', async () => {
        const responseData = { success: true };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers(),
            json: () => Promise.resolve(responseData),
        });

        const result = await JsonNetworkAdapter.post('http://example.com/api', { key: 'value' }, {
            headers: { 'Content-type': 'application/json', 'Service-Header': 'test' }
        });

        expect(result.data).toEqual(responseData);
        expect(result.status).toBe(200);
        expect(result.statusText).toBe('Connection successful!');
    });

    it('rejects with error details when response is not ok', async () => {
        const errorData = { error: 'Not found' };
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            headers: new Headers(),
            json: () => Promise.resolve(errorData),
        });

        await expect(
            JsonNetworkAdapter.post('http://example.com/api', {}, {
                headers: { 'Content-type': 'application/json' }
            })
        ).rejects.toMatchObject({
            message: 'Request failed',
            status: 404,
            statusText: 'Not Found',
            data: errorData,
        });
    });

    it('handles JSON parse failure gracefully', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers(),
            json: () => Promise.reject(new Error('Invalid JSON')),
        });

        const result = await JsonNetworkAdapter.post('http://example.com/api', {}, {
            headers: { 'Content-type': 'application/json' }
        });

        expect(result.data).toEqual({});
        expect(result.status).toBe(200);
    });

    it('rejects with network error when fetch throws', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

        await expect(
            JsonNetworkAdapter.post('http://example.com/api', {}, {
                headers: { 'Content-type': 'application/json' }
            })
        ).rejects.toMatchObject({
            message: 'Connection refused',
            status: 0,
            statusText: 'Network Error',
        });
    });

    it('rejects with timeout error when request is aborted', async () => {
        const abortError = new Error('Aborted');
        abortError.name = 'AbortError';
        mockFetch.mockRejectedValueOnce(abortError);

        await expect(
            JsonNetworkAdapter.post('http://example.com/api', {}, {
                headers: { 'Content-type': 'application/json' }
            })
        ).rejects.toMatchObject({
            message: 'Request timeout',
            status: 408,
            statusText: 'Request Timeout',
        });
    });

    it('makes a GET request correctly', async () => {
        const responseData = { items: [1, 2, 3] };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            statusText: 'OK',
            headers: new Headers(),
            json: () => Promise.resolve(responseData),
        });

        const result = await JsonNetworkAdapter.get('http://example.com/api/items', {
            headers: { 'Content-type': 'application/json' }
        });

        expect(result.data).toEqual(responseData);
        expect(result.status).toBe(200);
        expect(mockFetch).toHaveBeenCalledWith(
            'http://example.com/api/items',
            expect.objectContaining({ method: 'GET' })
        );
    });
});
