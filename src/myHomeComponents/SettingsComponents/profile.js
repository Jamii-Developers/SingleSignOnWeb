import React from "react";

import JsonNetworkAdapter from "../../configs/networkadapter";
import ServerErrorMsg from "../../frequentlyUsedModals/servererrormsg";
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg'
import Lock from "../../configs/encryption";

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
  
const Profile =( )=> {
	
	const [ cookies ] = useCookies( "userSession" );
	const [ data, setData ] = useState(null);
	const [ loginButtonSpinner, setLoginButtonSpinner ] = useState( false );
	const secretKey = cookies.userSession.USER_KEY;

	const[ serverErrorResponse , setServerErrorResponse ] = useState({
        serverErrorCode : "",
        serverErrorSubject: "",
        serverErrorMessage: "",
        errServMsgShow : false
  	});

  	const[ serverSuccessResponse, setServerSuccessResponse ] = useState({
        ui_subject : "",
        ui_message : "",
        succServMsgShow: false
  	});

	const [ pageFields, setPageFields ] = useState({
		firstname : "",
		middlename : "",
		lastname : "",
		address1 : "",
		address2 : "",
		city : "",
		state : "",
		province : "",
		zipcode : "",
		country : "",
		privacy : false
	});

	async function SetFormData( result ) {
		setPageFields( prevState => { return { ...prevState , firstname : result.firstname } } );
		setPageFields( prevState => { return { ...prevState , middlename : result.middlename } } );
		setPageFields( prevState => { return { ...prevState , lastname : result.lastname } } );
		setPageFields( prevState => { return { ...prevState , address1 : result.address1 } } );
		setPageFields( prevState => { return { ...prevState , address2 : result.address2 } } );
		setPageFields( prevState => { return { ...prevState , city : result.city } } );
		setPageFields( prevState => { return { ...prevState , state : result.state } } );
		setPageFields( prevState => { return { ...prevState , province : result.province } } );
		setPageFields( prevState => { return { ...prevState , zipcode : result.zipcode } } );
		setPageFields( prevState => { return { ...prevState , country : result.country } } );
		if( result.privacy === 0){
			setPageFields( prevState => { return { ...prevState , privacy : false } } );
		}else if( result.privacy === 1 ){
			setPageFields( prevState => { return { ...prevState , privacy : true } } );
		}
	}

	const getPrivacy = ( ) => {
		if( pageFields.privacy === true ){
			return 1;
		}else if( pageFields.privacy === false ){
			return 0;
		}
	}

	async function ApplyUserData( ){
		try{
			const cachedData = localStorage.getItem( "cachedUserData" );
			if( cachedData ){
				let cache = JSON.parse( Lock( "decrypt", cachedData, secretKey ) );
				setData( cache );
				await SetFormData( cache )
			}else{
				await FetchLatestUserData( );
			}
		}catch( error ){
			console.log(error)
		}
	};

    async function FetchLatestUserData( ) {
		
		let userkey = cookies.userSession.USER_KEY;
		let devicekey = cookies.userSession.DEVICE_KEY;
		let sessionkey = cookies.userSession.SESSION_KEY;

        var cookieData = { 
            userkey,
            devicekey,
			sessionkey
        };
		
		var fetchuserdataUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'user/fetchprofile';
		const result = await JsonNetworkAdapter.post( fetchuserdataUrl, cookieData )
        	.then((response) =>{ return response.data })
			.catch((error) => { return error;});

		if( result.status === 404 ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.message } } );
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } );
            return;
        }
		
		var MSGTYPE = process.env.REACT_APP_RESPONSE_TYPE_ERROR_MESSAGE;
		var ERRORCODE = process.env.REACT_APP_ERROR_CODE_0048;
		if( result.MSGTYPE === MSGTYPE && result.ERROR_FIELD_CODE === ERRORCODE ){
			setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.ERROR_FIELD_CODE } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.ERROR_FIELD_SUBJECT  } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : result.ERROR_FIELD_MESSAGE } } );
            setServerErrorResponse( prevState => { return { ...prevState , errServMsgShow : true } } );
			setData( " " );
            return;
		}
        
		localStorage.setItem( 'cachedUserData',  Lock( "encrypt", JSON.stringify( result ),secretKey ) );
	    setData( JSON.parse( JSON.stringify( result ) ) ) ;
		SetFormData( result )
    }

	

	const CheckNullException = ( value, option ) =>{
		if( value === null ){
			return option;
		}else if ( typeof( value ) === Object){
			return option;
		}else if ( value === undefined){
			return option;
		}else if ( value === ""){
			return option;
		}
		else{
			return value;
		}
	}
	
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { ApplyUserData( ) }, [ ]) ;

	if( !data ){
		return (
			<div class="text-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		)
	}

	const Clear = ( ) => {
		document.getElementById("UserProfileForm").reset( );
		const cachedData = localStorage.getItem( "cachedUserData" );
		let result = JSON.parse( Lock( "decrypt", cachedData, secretKey ) );
		setPageFields( prevState => { return { ...prevState , firstname : result.firstname } } );
		setPageFields( prevState => { return { ...prevState , middlename : result.middlename } } );
		setPageFields( prevState => { return { ...prevState , lastname : result.lastname } } );
		setPageFields( prevState => { return { ...prevState , address1 : result.address1 } } );
		setPageFields( prevState => { return { ...prevState , address2 : result.address2 } } );
		setPageFields( prevState => { return { ...prevState , city : result.city } } );
		setPageFields( prevState => { return { ...prevState , state : result.state } } );
		setPageFields( prevState => { return { ...prevState , province : result.province } } );
		setPageFields( prevState => { return { ...prevState , zipcode : result.zipcode } } );
		setPageFields( prevState => { return { ...prevState , country : result.country } } );
		if( result.privacy === 0){
			setPageFields( prevState => { return { ...prevState , privacy : false } } );
		}else if( result.privacy === 1 ){
			setPageFields( prevState => { return { ...prevState , privacy : true } } );
		}
	}

	const Update = async( ) => {
		setLoginButtonSpinner( true );

		let userKey = cookies.userSession.USER_KEY;
		let deviceKey = cookies.userSession.DEVICE_KEY;
		let sessionKey = cookies.userSession.SESSION_KEY;
		let firstname = pageFields.firstname;
		let middlename = pageFields.middlename;
		let lastname = pageFields.lastname;
		let address1 = pageFields.address1;
		let address2 = pageFields.address2;
		let city = pageFields.city;
		let state = pageFields.state;
		let province = pageFields.province;
		let country = pageFields.country;
		let zipcode = pageFields.zipcode;
		let privacy = getPrivacy( );

		let postData = { userKey, deviceKey, sessionKey ,firstname, middlename, lastname, address1, address2, city, state, province, country, zipcode, privacy };

		var edituserdataUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'user/editprofile';
		const result = await JsonNetworkAdapter.post( edituserdataUrl, postData )
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
			setLoginButtonSpinner( false );
            return;
        }

		localStorage.removeItem( 'cachedUserData');
		let storeData = {firstname, middlename, lastname, address1, address2, city, state, province, country, zipcode, privacy}
		localStorage.setItem( 'cachedUserData',  Lock( "encrypt", JSON.stringify( storeData ), secretKey ) );

		let succMessageShow = process.env.REACT_APP_RESPONSE_TYPE_EDIT_USER_DATA
		if( result.MSG_TYPE === succMessageShow ){
			setServerSuccessResponse( prevState => { return { ...prevState , ui_subject : result.UI_SUBJECT } } )
            setServerSuccessResponse( prevState => { return { ...prevState , ui_message : result.UI_MESSAGE } } )
            setServerSuccessResponse( prevState => { return { ...prevState , succServMsgShow: true } } );
			Clear( );
		}

		setLoginButtonSpinner( false );
	}

	return (
		<div>
		<h1>Profile</h1>
		
		<Form id = "UserProfileForm" >

			<Row>
				<Col>
					<Form.Check type="switch" id="privacySwitch" label="Set Account Privacy" className="mb-3" checked = {pageFields.privacy}
						onChange={ ( e ) => setPageFields( prevState => { return { ...prevState , privacy : e.target.checked } } ) }
						
					/>
				</Col>
			</Row>

			<Row>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Username</Form.Label>
						<Form.Control type="text"  placeholder={cookies.userSession.USERNAME} disabled readOnly/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Email address</Form.Label>
						<Form.Control type="text" placeholder={cookies.userSession.EMAIL_ADDRESS} disabled readOnly/>
					</Form.Group>
				</Col>

			</Row>

			<Row>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>First Name</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException(pageFields.firstname,"First Name")}
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , firstname : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Middle Name</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( pageFields.middlename,"Middle Name" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , middlename : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Last Name</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( pageFields.lastname,"Last Name" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , lastname : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

			</Row>

			<Row>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>Address 1</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( pageFields.address1,"Address 1" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , address1 : e.target.value } } ) }
							/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>Address 2</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( pageFields.address2,"Address 2" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , address2 : e.target.value } } ) }
							/>
						</Form.Group>
				</Col>

			</Row>

			<Row>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>City</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( pageFields.city,"City" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , city : e.target.value } } ) }
							/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>State</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( pageFields.state,"State" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , state : e.target.value } } ) }/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Province</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( pageFields.province,"Province" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , province : e.target.value } } ) }
						/>
						</Form.Group>
				</Col>

			</Row>

			<Row>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Zip code</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( pageFields.zipcode,"Zip Code" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , zipcode : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Country</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( pageFields.country,"Country" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , country : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

			</Row>

			<Row>
				<Col>
					<ButtonGroup size="md" className="mb-2">
						<Button variant="outline-primary" type="button" onClick = { ( ) => Update( ) }>
							{loginButtonSpinner && <Spinner as="span"animation="grow"size="sm" role="status" aria-hidden="false"/>}
							Update
						</Button>
						<Button variant="outline-info" type="button" onClick = { ( ) => Clear( ) }>Clear</Button>
					</ButtonGroup>
				</Col>
			</Row> 

		</Form>

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

		</div>
	)
};
  
export default Profile;