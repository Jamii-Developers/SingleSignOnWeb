import { useCookies } from "react-cookie";

const useSessionCredentials = () => {
    const [cookies] = useCookies("userSession");

    const getSessionData = () => ({
        deviceKey: cookies.userSession.DEVICE_KEY,
        userKey: cookies.userSession.USER_KEY,
        sessionKey: cookies.userSession.SESSION_KEY
    });

    const getUserInfo = () => ({
        username: cookies.userSession.USERNAME,
        emailAddress: cookies.userSession.EMAIL_ADDRESS,
        userKey: cookies.userSession.USER_KEY
    });

    return {
        cookies,
        getSessionData,
        getUserInfo
    };
};

export default useSessionCredentials;
