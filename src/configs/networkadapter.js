import axios from 'axios';

// Create a new instance of Axios with a custom adapter
const JsonNetworkAdapter = axios.create({
    adapter: (config) => {
        // Customize the config here if needed
        return new Promise((resolve, reject) => {
            // Use your custom logic to send the request (e.g., fetch API)
            fetch(config.url, {
                method: config.method.toUpperCase(),
                mode: "cors",
                headers: config.headers,
                body: config.data
            })
                .then( async (response) => {
                    // Customize the response here if needed
                    const responseData = await response.json().catch( ( ) => ( { } ) ); // Ensure JSON parsing doesn't fail

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
                    // Handle errors here
                    reject(error)
                    reject({
                        message: "Something went wrong!",
                        status: 404,
                        statusText: "Oops!",
                        config: config,
                    });
                });
        });
    },
});

export default JsonNetworkAdapter;