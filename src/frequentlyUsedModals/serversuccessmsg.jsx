import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './sass/serversuccessmsg.sass';

const ServerSuccessMsg = ({ show, onClose, subject, message }) => {
    const [timer, setTimer] = useState(5);

    useEffect(() => {
        if (show) {
            setTimer(5);
            const countdown = setInterval(() => {
                setTimer((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdown);
                        onClose();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdown);
        }
    }, [show, onClose]);

    return (
        <div >
            <Modal show={show} onHide={onClose} centered dialogClassName="success-dialog">
                <Modal.Header className="success-header" closeButton>
                    <Modal.Title className="success-title">{subject}</Modal.Title>
                    <div className="success-timer-bar">
                        <div 
                            className="success-timer-progress" 
                            style={{ width: `${(timer / 5) * 100}%` }}
                        />
                    </div>
                </Modal.Header>
                <Modal.Body className="success-body">
                    <p>{message}</p>
                </Modal.Body>
                <Modal.Footer className="success-footer">
                    <Button variant="outline-success" className="success-close-btn" onClick={onClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ServerSuccessMsg;
