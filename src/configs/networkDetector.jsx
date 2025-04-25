import Conn from './conn';

const NetworkDetector = async() => {
    for (let baseUrl of Conn.SERVERS) {
        try {
            const res = await fetch(baseUrl + 'health', { method: 'POST', mode: 'cors' } );
            if (res.ok) {
                Conn.setServer(baseUrl);
                console.log(`✅ Connected to server: ${baseUrl}`);
                return;
            }
        } catch (e) {
            console.warn(`⚠️ Failed to connect to ${baseUrl}`);
        }
    }
    throw new Error("🚫 No servers are available!");
}

export default NetworkDetector;