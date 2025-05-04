import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './sass/servererrormsg.sass';

const ServerErrorMsg = ({ show, onClose, subject, message }) => {
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        if (show) {
            setTimer(5);
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        // onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [show, onClose]);

    return (
        <div id="error-modal" className="error-modal">
            <Modal show={show} onHide={onClose} centered dialogClassName="error-dialog">
                <Modal.Header className="error-header" closeButton>
                    <Modal.Title className="error-title">{subject}</Modal.Title>
                    <div className="error-timer-bar">
                        <div 
                            className="error-timer-progress" 
                            style={{ width: `${(timer / 5) * 100}%` }}
                        />
                    </div>
                </Modal.Header>
                <Modal.Body className="error-body">
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer className="error-footer">
                    <Button variant="outline-danger" className="error-close-btn" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServerErrorMsg;
