import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-800">
            <h1 className="text-5xl font-bold mb-4">404</h1>
            <p className="text-xl mb-8">Oops! The page you are looking for doesn't exist.</p>
            <Link to="/" className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300">
                Go to Home
            </Link>
        </div>
    );
};

export default NotFound;