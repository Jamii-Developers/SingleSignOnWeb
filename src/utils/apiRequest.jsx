import JsonNetworkAdapter from '../configs/networkadapter';
import conn from '../configs/conn';
import constants from './constants';

const buildHeaders = (serviceHeader) => ({
    ...conn.CONTENT_TYPE.CONTENT_JSON,
    ...serviceHeader
});

const apiRequest = async (url, data, serviceHeader, {
    showError,
    showSuccess,
    successMsgType,
    onSuccess,
    onError,
    showNetworkError,
    networkErrorAction
} = {}) => {
    const headers = buildHeaders(serviceHeader);

    try {
        const result = await JsonNetworkAdapter.post(url, data, { headers });

        if (result.status !== 200) {
            if (showError) {
                showError(result.status, result.statusText, result.message);
            }
            if (onError) onError(result);
            return { success: false, result };
        }

        if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
            if (showError) {
                showError(
                    result.data.ERROR_FIELD_CODE,
                    result.data.ERROR_FIELD_SUBJECT,
                    result.data.ERROR_FIELD_MESSAGE
                );
            }
            if (onError) onError(result);
            return { success: false, result };
        }

        if (successMsgType && result.data.MSG_TYPE === successMsgType && showSuccess) {
            showSuccess(result.data.UI_SUBJECT, result.data.UI_MESSAGE);
        }

        if (onSuccess) onSuccess(result);
        return { success: true, result };
    } catch (error) {
        if (showNetworkError) {
            showNetworkError(networkErrorAction);
        } else if (showError) {
            showError(
                "Network Error",
                "Connection Error",
                "Unable to connect to the server. Please try again later."
            );
        }
        if (onError) onError(error);
        return { success: false, error };
    }
};

export { buildHeaders };
export default apiRequest;
