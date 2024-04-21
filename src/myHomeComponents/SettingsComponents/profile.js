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

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
  
const Profile =( )=> {
	
	const [ cookies ] = useCookies( "userSession" );
	const [ data, setData ] = useState(null);
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

	async function SetPrivacy( value ) {
		if( value === 0){
			setPageFields( prevState => { return { ...prevState , privacy : false } } );
		}else if( value === 1 ){
			setPageFields( prevState => { return { ...prevState , privacy : true } } );
		}
	}

	async function ApplyUserData( ){
		try{
			const cachedData = localStorage.getItem( "cachedUserData" );
			if( cachedData ){
				let cache = JSON.parse( Lock( "decrypt", cachedData, secretKey ) );
				setData( cache );
				SetPrivacy( cache.privacy )
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

        var cookieData = { 
            userkey,
            devicekey
        };
		
		var fetchuserdataUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'fetchuserdata';
		const result = await JsonNetworkAdapter.post( fetchuserdataUrl, cookieData )
        .then((response) =>{ return response.data })

		console.log( result )

		if( result.status === 400 ){
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorCode : result.status } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorSubject : result.statusText  } } );
            setServerErrorResponse( prevState => { return { ...prevState , serverErrorMessage : "There is an error with your connection" } } );
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
		SetPrivacy( result.privacy )
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
		return <div>Loading...</div>
	}

	const Clear = ( ) => {
		document.getElementById("UserProfileForm").reset( );
	}

	const Update = ( ) => {
		let userkey = cookies.userSession.USER_KEY;
		let devicekey = cookies.userSession.DEVICE_KEY;
		let firstname = pageFields.firstname;
		let middlename = pageFields.middlename;
		let lastname = pageFields.lastname;
		let address1 = pageFields.address1;
		let address2 = pageFields.address2;
		let city = pageFields.city;
		let state = pageFields.state;
		let province = pageFields.province;
		let country = pageFields.country;
		let privacy = pageFields.privacy;
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
							placeholder={ CheckNullException(data.firstname,"First Name")}
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , firstname : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Middle Name</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( data.middlename,"Middle Name" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , middlename : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Last Name</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( data.lastname,"Last Name" ) } 
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
								placeholder={ CheckNullException( data.address1,"Address 1" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , address1 : e.target.value } } ) }
							/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>Address 2</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( data.address2,"Address 2" ) } 
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
								placeholder={ CheckNullException( data.city,"City" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , city : e.target.value } } ) }
							/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
							<Form.Label>State</Form.Label>
							<Form.Control type="text" 
								placeholder={ CheckNullException( data.state,"State" ) } 
								onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , state : e.target.value } } ) }/>
						</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Province</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( data.province,"Province" ) } 
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
							placeholder={ CheckNullException( data.zipcode,"Zip Code" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , zipcode : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

				<Col>
					<Form.Group className="mb-3" >
						<Form.Label>Country</Form.Label>
						<Form.Control type="text" 
							placeholder={ CheckNullException( data.zipcode,"Country" ) } 
							onInput={ ( e ) => setPageFields( prevState => { return { ...prevState , country : e.target.value } } ) }
						/>
					</Form.Group>
				</Col>

			</Row>

			<Row>
				<Col>
					<ButtonGroup size="md" className="mb-2">
						<Button variant="outline-primary" type="button" onClick = { ( ) => Update( ) }>Update</Button>
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