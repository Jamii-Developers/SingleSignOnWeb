import React from "react";

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import CryptoJS from 'crypto-js';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
  
const Profile = () => {
	
	const [ cookies ] = useCookies( "userSession" );
	const [ data, setData ] = useState(null);
	const secretKey = cookies.userSession.USER_KEY;

	useEffect( ( ) => { ApplyUserData( ) }, [ ] );

	function Encrypt ( string ){
		return CryptoJS.AES.encrypt( JSON.stringify( string ), secretKey).toString( );
	}

	function Decrypt ( string ){
		const bytes = CryptoJS.AES.decrypt( string, secretKey );
      	const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      	return decryptedData;
	}

	async function ApplyUserData( ){
		try{
			const cachedData = localStorage.getItem("cachedUserData");
			if( cachedData ){
				setData( JSON.parse( Decrypt( cachedData ) ) );
			}else{
				FetchLatestUserData( );
			}
		}catch( error ){
			console.log(error)
		}
		console.log(  data );
	}

    async function FetchLatestUserData( ) {

		let userkey = cookies.userSession.USER_KEY;
		let devicekey = cookies.userSession.DEVICE_KEY;

        var cookieData = { 
            userkey,
            devicekey
        };

        var cookieJSON = JSON.stringify(cookieData);

        var fetchuserdataUrl = process.env.REACT_APP_SINGLE_SIGNON_URL+'fetchuserdata';
        const response = await fetch(fetchuserdataUrl, {
          method: 'POST',
          body: cookieJSON,
          headers: {
            'Content-Type': 'application/json'
          }
        } ) ;

		const result = await response.json( ) ;
		localStorage.setItem( 'cachedUserData',  Encrypt( JSON.stringify(result) ) );
	    setData( JSON.parse( JSON.stringify( result ) ) ) ;
    }
	

  return (
    <div>
      <h1>Profile</h1>
      
      <Form controlId = "UserProfileForm">
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
							<Form.Label>Firstname</Form.Label>
							<Form.Control type="text" placeholder={data.firstname}/>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
							<Form.Label>Middlename</Form.Label>
							<Form.Control type="text" placeholder={data.middlename} />
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
							<Form.Label>Lastname</Form.Label>
							<Form.Control type="text" placeholder={data.lastname} />
						</Form.Group>
					</Col>

				</Row>

				<Row>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>Address 1</Form.Label>
								<Form.Control type="text" placeholder={data.address1} />
							</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>Address 2</Form.Label>
								<Form.Control type="text" placeholder={data.address2} />
							</Form.Group>
					</Col>

				</Row>

				<Row>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>City</Form.Label>
								<Form.Control type="text" placeholder={data.city} />
							</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>State</Form.Label>
								<Form.Control type="text" placeholder={data.state} />
							</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>Province</Form.Label>
								<Form.Control type="text" placeholder={data.province} />
							</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3" >
								<Form.Label>Zip code</Form.Label>
								<Form.Control type="text" placeholder={data.zipcode} />
							</Form.Group>
					</Col>

				</Row>

				<Row>
					<Col>
						<ButtonGroup size="md" className="mb-2">
							<Button variant="outline-primary" type="button">Update</Button>
							<Button variant="outline-info" type="button">Clear</Button>
						</ButtonGroup>
					</Col>
				</Row>

			</Form>

    </div>
  );
};
  
export default Profile;