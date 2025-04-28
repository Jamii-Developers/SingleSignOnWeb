import Conn from './conn';

const TIMEOUT_DURATION = 5000; // 5 seconds timeout

const NetworkDetector = async() => {
    for (let baseUrl of Conn.SERVERS) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

            const res = await fetch(baseUrl + 'health', { 
                method: 'POST', 
                mode: 'cors',
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (res.ok) {
                Conn.setServer(baseUrl);
                console.log(`✅ Connected to server: ${baseUrl}`);
                return;
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                console.warn(`⚠️ Connection timeout for ${baseUrl}`);
            } else {
                console.warn(`⚠️ Failed to connect to ${baseUrl}`);
            }
        }
    }
    throw new Error("🚫 No servers are available!");
}

export default NetworkDetector;