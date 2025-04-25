

let selectedServer = null;

const Conn = {
    SERVERS : [
        'http://localhost:8080/api/',
        'https://singlesignonservice.onrender.com/api/'
    ],
    setServer: (url) => {
        selectedServer = url;
    },
    getServer: () => selectedServer,
    URL : {
        get PUBLIC_URL() {
            return selectedServer ? selectedServer + 'public' : null;
        },
        get USER_URL() {
            return selectedServer ? selectedServer + 'user' : null;
        }
    },
    CONTENT_TYPE : {
        CONTENT_JSON: {'Content-type': 'application/json'},
    },
    SERVICE_HEADERS: {
        USER_LOGIN:         {'Service-Header' : 'userlogin'},
        CREATE_NEW_USER:    {'Service-Header' : 'createnewuser'},
        EDIT_PROFILE:       {'Service-Header' : 'editprofile'},
        FETCH_PROFILE:      {'Service-Header' : 'fetchprofile'},
        USER_LOGOFF:        {'Service-Header' : 'userlogoff'},
        REVIEW_US :         {'Service-Header' : 'reviewus' },
        CONTACT_SUPPORT :   {'Service-Header' : 'contactsupport' }
    },
};

export default Conn;
