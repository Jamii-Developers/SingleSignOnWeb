import axios from 'axios';

const TIMEOUT_DURATION = 30000; // 30 seconds timeout

// Create a new instance of Axios with a custom adapter
const JsonNetworkAdapter = axios.create({
    adapter: (config) => {
        // Customize the config here if needed
        return new Promise((resolve, reject) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_DURATION);

            // Use your custom logic to send the request (e.g., fetch API)
            fetch(config.url, {
                method: config.method.toUpperCase(),
                mode: "cors",
                headers: config.headers,
                body: config.data,
                signal: controller.signal,
                authentication : localStorage.getItem('userSession') !== null ? JSON.parse(localStorage.getItem('userSession')).token : null
            })
                .then(async (response) => {
                    clearTimeout(timeoutId);
                    // Customize the response here if needed
                    const responseData = await response.json().catch(() => ({})); // Ensure JSON parsing doesn't fail

                    if (!response.ok) {
                        return reject({
                            message: "Request failed",
                            status: response.status,
                            statusText: response.statusText,
                            data: responseData,
                            config: config,
                        });
                    }
                    resolve({
                        data: responseData,
                        status: response.status,
                        statusText: "Connection successful!",
                        headers: response.headers,
                        config: config,
                    });
                })
                .catch((error) => {
                    clearTimeout(timeoutId);
                    // Handle errors here
                    if (error.name === 'AbortError') {
                        reject({
                            message: "Request timeout",
                            status: 408,
                            statusText: "Request Timeout",
                            config: config,
                        });
                    } else {
                        reject(error);
                        reject({
                            message: "Something went wrong!",
                            status: 404,
                            statusText: "Oops!",
                            config: config,
                        });
                    }
                });
        });
    },
});

export default JsonNetworkAdapter;