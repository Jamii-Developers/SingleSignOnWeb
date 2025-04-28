import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../sass/messages.sass';

function Servererrormsg(props) {
    return (
        <div className={`message-container ${props.open ? 'show' : 'hide'}`}>
            <div className="error-message">
                <FaExclamationCircle className="icon" />
                <div className="content">
                    <div className="subject">{props.errorsubject}</div>
                    <div className="message">{props.errormessage}</div>
                </div>
            </div>
        </div>
    );
}

export default Servererrormsg;
