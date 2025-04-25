import Conn from "../configs/conn";

const Constants = {

    RESPONSE_MESSAGE : {
        TYPE_ERROR_MESSAGE :    "ERR|001",
        TYPE_USERLOGIN :        "SUC|001",
        TYPE_CREATE_NEW_USER :  "SUC|002",
        TYPE_EDIT_USER_DATA :   "SUC|003",
        TYPE_CHANGE_PASSWORD :  "SUC|004",
        TYPE_EDIT_REACTIVATE :  "SUC|005",
        TYPE_EDIT_DEACTIVATE :  "SUC|006",
        TYPE_CONTACTUS :        "SUC|007",
        TYPE_LOGOFF:            "SUC|024"
    }
};

export default Constants;