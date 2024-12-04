import '../sass/myhomeindexheader.sass';
import ServerErrorMsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg'
import JsonNetworkAdapter from '../configs/networkadapter';

import React from 'react';

import { Outlet, Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect , useState } from "react";
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';


const Header = ( ) => {

	const [ cookies, setCookie ] = useCookies( "userSession" );
  	const navigate = useNavigate( );

	const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

	  const[ serverErrorResponse , setServerErrorResponse ] = useState({
        serverErrorCode : "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow : false
  	});

	useEffect( ( ) => { CheckIfCoockieExists( ) } );
    function CheckIfCoockieExists() {
        if( !cookies.userSession   ){
            navigate("/");
        } 
    }

	async function DestroyCookie( ){

		var userLogoffUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'userlogoff';
		let userkey = cookies.userSession.USER_KEY;
		let devicekey = cookies.userSession.DEVICE_KEY;
		let sessionkey = cookies.userSession.SESSION_KEY;
    
		var logoffJson = {
			userkey,
			devicekey,
			sessionkey
		}
        const result = await JsonNetworkAdapter.post( userLogoffUrl, logoffJson )
        	.then((response) =>{ return response.data })
			.catch((error) => { return error;});


		if( result.status === 404 ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.message } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
            return;
        }

		var error_message_type = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE
        if( error_message_type === result.ERROR_MSG_TYPE ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } )
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } )
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } )
			await new Promise(r => setTimeout(r, 3000));
        }

		var succ_message_type = process.env.REACT_APP_RESPONSE_TYPE_LOGOFF
        if( succ_message_type === result.MSG_TYPE ){
            setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
            setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
            setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
			await new Promise(r => setTimeout(r, 3000));
        }

		setCookie( "userSession", null,  {path: "/", maxAge: -999999 } );
		localStorage.removeItem('cachedUserData');
		navigate("/");
	}


    return(
		<div id = "MyHomeHeaderPage" >
			<div id = "SidebarContent">
				<Sidebar data-bs-theme="dark" bg="primary">
					<Menu>
						<MenuItem component={<Link to="/myhome/dashboard"/>}>Home</MenuItem>
						<MenuItem component={<Link to="/myhome/social/"/>}>Social</MenuItem>
						<MenuItem component={<Link to="/myhome/filemanagement"/>}>File Management</MenuItem>
						<MenuItem component={<Link to="/myhome/settings"/>}>Settings</MenuItem>
						<MenuItem component={<Link to="/myhome/aboutus"/>}>About Us</MenuItem>
						<MenuItem component={ <Link to="/myhome/contactus"/> }>Contact Us</MenuItem>
						<MenuItem onClick={ ( ) => DestroyCookie( ) }>Log Out</MenuItem>
					</Menu>
				</Sidebar>
			</div>

			< ServerErrorMsg 
                open={serverErrorResponse.errServMsgShow}  
                onClose={ ( ) => setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : false } } ) }
                errorcode = {serverErrorResponse.serverErrorCode} 
                errorsubject = {serverErrorResponse.serverErrorSubject} 
                errormessage = {serverErrorResponse.serverErrorMessage}                             
            />

            < ServerSuccessMsg 
                open={serverSuccessResponse.succServMsgShow}  
                onClose={ ( ) => setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow : false } } ) }
                ui_subject = {serverSuccessResponse.ui_subject} 
                ui_message = {serverSuccessResponse.ui_message}                             
            />

			<div id = "MainContent">
				<Outlet />
			</div>
		</div>
    )
}



export default Header