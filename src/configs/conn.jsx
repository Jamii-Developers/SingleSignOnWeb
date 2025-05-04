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
        CONTACT_SUPPORT :   {'Service-Header' : 'contactsupport' },
        VALIDATE_SESSION :  {'Service-Header' : 'validate-session' },
        SEARCH_USERS :      {'Service-Header' : 'searchuser' },
        USER_FILE_UPLOAD:   {'Service-Header' : 'userfileupload'},
        USER_DIR_UPDATE:    {'Service-Header' : 'userdirupd'},
        USER_FILE_DELETE:   {'Service-Header' : 'userfiledel'},
        USER_FILE_DOWNLOAD: {'Service-Header' : 'userfiledwnld'},
        CHANGE_PASSWORD:    {'Service-Header' : 'chngpassword'},
        DEACTIVATE_USER:    {'Service-Header' : 'deactivateuser'},
        SEND_FRIEND_REQUEST: {'Service-Header' : 'sendfriendrequest'},
        GET_FRIEND_REQUEST_LIST: {'Service-Header' : 'getfriendrequestlist'},
        GET_FOLLOWER_LIST: {'Service-Header' : 'getfollowerlist'},
        GET_FOLLOWER_REQUEST_LIST: {'Service-Header' : 'getfollowerrequestlist'},
        SEND_FOLLOW_REQUEST: {'Service-Header' : 'sendfollowrequest'},
        ACCEPT_FRIEND_REQUEST: {'Service-Header' : 'acceptfriendrequest'},
        ACCEPT_FOLLOW_REQUEST: {'Service-Header' : 'acceptfollowrequest'},
        REJECT_FRIEND_REQUEST: {'Service-Header' : 'rejectfriendrequest'},
        REJECT_FOLLOW_REQUEST: {'Service-Header' : 'rejectfollowrequest'},
        BLOCK_USER: {'Service-Header' : 'blockuser'},
        GET_FRIEND_LIST: {'Service-Header' : 'getfriendlist'},
        GET_BLOCK_USER_LIST: {'Service-Header' : 'getblockuserlist'}
    },
};

export default Conn;
