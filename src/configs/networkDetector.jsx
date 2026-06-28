import Conn from './conn';

const TIMEOUT_DURATION = 5000; // 5 seconds timeout
const SERVER_CACHE_KEY = 'selectedServer';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const testServerConnection = async (baseUrl) => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

        const res = await fetch(baseUrl + 'jhealth', {
            method: 'POST', 
            mode: 'cors',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        return res.ok;
    } catch {
        return false;
    }
};

const NetworkDetector = async () => {
    // Check if we have a cached server selection
    const cachedServer = localStorage.getItem(SERVER_CACHE_KEY);
    if (cachedServer) {
        try {
            const { url, timestamp } = JSON.parse(cachedServer);
            // If the cache is still valid, test the connection
            if (url && timestamp && Date.now() - timestamp < CACHE_DURATION) {
                const isConnected = await testServerConnection(url);
                if (isConnected) {
                    Conn.setServer(url);
                    return;
                }
            }
            // If cached server fails or cache is invalid, remove it
            localStorage.removeItem(SERVER_CACHE_KEY);
        } catch (e) {
            console.warn("Corrupt server cache entry, clearing it");
            localStorage.removeItem(SERVER_CACHE_KEY);
        }
    }

    // If no valid cache exists or cached server failed, try all servers
    for (let baseUrl of Conn.SERVERS) {
        const isConnected = await testServerConnection(baseUrl);
        if (isConnected) {
            // Cache the successful server selection
            const serverCache = {
                url: baseUrl,
                timestamp: Date.now()
            };
            localStorage.setItem(SERVER_CACHE_KEY, JSON.stringify(serverCache));
            
            Conn.setServer(baseUrl);
            return;
        }
    }
    throw new Error("🚫 No servers are available!");
};

export default NetworkDetector;