import React from 'react';

const LoadingSpinner = ({ className = "text-center p-5", variant = "text-primary" }) => (
    <div className={className}>
        <div className={`spinner-border ${variant}`} role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

export default LoadingSpinner;
