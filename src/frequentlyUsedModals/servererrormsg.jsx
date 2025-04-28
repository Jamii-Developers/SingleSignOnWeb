import React from 'react';
import { FaExclamationCircle } from 'react-icons/fa';
import '../sass/messages.sass';

function Servererrormsg(props) {
    console.log( "ERROR MSG", props.open ? 'show' : 'hide');
    return (
        <div className={`server-message-container ${props.open ? 'show' : 'hide'}`}>
            <div className="server-error-message">
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
