import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import '../sass/messages.sass';

function ServerSuccessMsg(props) {
    
    return (
        <div className={`server-message-container ${props.open ? 'show' : 'hide'}`}>
            <div className="server-success-message">
                <FaCheckCircle className="icon" />
                <div className="content">
                    <div className="subject">{props.ui_subject}</div>
                    <div className="message">{props.ui_message}</div>
                </div>
            </div>
        </div>
    );
}

export default ServerSuccessMsg;
