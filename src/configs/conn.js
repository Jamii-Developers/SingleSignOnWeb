const ROOT_CONN = 'http://127.0.0.1:8080/api/';
const Conn = {

    URL : {
        PUBLIC_URL: ROOT_CONN + 'public',
        USER_URL: ROOT_CONN + 'user',
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
    }
};

export default Conn;
