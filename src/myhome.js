import './sass/myhome.sass';
// import ServerErrorMsg from '../frequentlyUsedModals/servererrormsg';
// import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg'

import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const MyHome = ( props ) => {

	const [ userSessionCookie, setCookie ] = useCookies( "userSession" );
    const navigate = useNavigate();

	useEffect( ( ) => { CheckIfCoockieExists( )});

    function CheckIfCoockieExists() {
        if( !("userSession" in userSessionCookie)  ){
            console.log( userSessionCookie.userSession )
            navigate("/");
        } 
    }

    return (
      <div>
        <h1>My Home</h1>
      </div>
    );
};

export default MyHome;