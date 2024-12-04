import axios from 'axios';

// Create a new instance of Axios with a custom adapter
const JsonNetworkAdapter = axios.create({
  adapter: (config) => {
    // Customize the config here if needed
    return new Promise((resolve, reject) => {
      // Use your custom logic to send the request (e.g., fetch API)
      fetch(config.url, {
        method: config.method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: config.data
      })
        .then((response) => {
          // Customize the response here if needed
          resolve({
            data: response.json(),
            status: response.status,
            statusText: "Connection successfull!",
            headers: response.headers,
            config: config,
          });
        })
        .catch((error) => {
          // Handle errors here
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