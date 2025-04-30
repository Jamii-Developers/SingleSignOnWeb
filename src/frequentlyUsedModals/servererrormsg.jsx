import React, { useEffect, useState } from 'react';
import { FaExclamationCircle, FaTimes } from 'react-icons/fa';
import '../sass/messages.sass';

const ServerErrorMsg = ({ subject, message, show, onClose }) => {
    const [isVisible, setIsVisible] = useState(show);
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        if (show) {
            setIsVisible(true);
            setTimer(5);
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        handleClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [show]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <div className={`server-message-container ${isVisible ? 'show' : 'hide'}`}>
            <div className="server-error-message">
                <div className="icon">
                    <FaExclamationCircle />
                </div>
                <div className="content">
                    <div className="subject">{subject}</div>
                    <div className="message">{message}</div>
                </div>
                <button className="close-button" onClick={handleClose}>
                    <FaTimes className="close-icon" />
                </button>
                <div className="timer-bar">
                    <div 
                        className="timer-progress" 
                        style={{ 
                            animation: `timerCountdown ${timer}s linear forwards`,
                            width: `${(timer / 5) * 100}%`
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default ServerErrorMsg;
