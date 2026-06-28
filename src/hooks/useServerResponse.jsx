import React, { useState, useCallback } from 'react';
import ServerErrorMsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg';

const useServerResponse = () => {
    const [serverErrorResponse, setServerErrorResponse] = useState({
        serverErrorCode: "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow: false
    });

    const [serverSuccessResponse, setServerSuccessResponse] = useState({
        ui_subject: "",
        ui_message: "",
        succServMsgShow: false
    });

    const showError = useCallback((code, subject, message) => {
        setServerErrorResponse({
            serverErrorCode: code || "",
            serverErrorSubject: subject || "",
            serverErrorMessage: message || "",
            errServMsgShow: true
        });
    }, []);

    const hideError = useCallback(() => {
        setServerErrorResponse(prev => ({ ...prev, errServMsgShow: false }));
    }, []);

    const showSuccess = useCallback((subject, message) => {
        setServerSuccessResponse({
            ui_subject: subject || "",
            ui_message: message || "",
            succServMsgShow: true
        });
    }, []);

    const hideSuccess = useCallback(() => {
        setServerSuccessResponse(prev => ({ ...prev, succServMsgShow: false }));
    }, []);

    const showNetworkError = useCallback((action = "") => {
        const actionText = action ? ` ${action}` : "";
        showError(
            "Network Error",
            "Connection Error",
            `Unable to${actionText} connect to the server. Please try again later.`
        );
    }, [showError]);

    const ServerResponseModals = useCallback(() => (
        <>
            <ServerErrorMsg
                show={serverErrorResponse.errServMsgShow}
                onClose={hideError}
                subject={serverErrorResponse.serverErrorSubject}
                message={serverErrorResponse.serverErrorMessage}
            />
            <ServerSuccessMsg
                show={serverSuccessResponse.succServMsgShow}
                onClose={hideSuccess}
                subject={serverSuccessResponse.ui_subject}
                message={serverSuccessResponse.ui_message}
            />
        </>
    ), [serverErrorResponse, serverSuccessResponse, hideError, hideSuccess]);

    return {
        serverErrorResponse,
        serverSuccessResponse,
        showError,
        hideError,
        showSuccess,
        hideSuccess,
        showNetworkError,
        ServerResponseModals
    };
};

export default useServerResponse;
