import React from "react";

import '../../sass/settings.sass';
import JsonNetworkAdapter from "../../configs/networkadapter";
import Servererrormsg from "../../frequentlyUsedModals/servererrormsg";
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg'
import Lock from "../../configs/encryption";
import constants from "../../utils/constants";

import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";
import conn from "../../configs/conn";
  
// Validation constants
const VALIDATION = {
	NAME_MAX_LENGTH: 50,
	ADDRESS_MAX_LENGTH: 100,
	CITY_MAX_LENGTH: 50,
	STATE_MAX_LENGTH: 50,
	PROVINCE_MAX_LENGTH: 50,
	COUNTRY_MAX_LENGTH: 50,
	ZIPCODE_MAX_LENGTH: 20,
	ZIPCODE_REGEX: /^[A-Z0-9\s-]+$/,
	NAME_REGEX: /^[A-Za-z\s'-]+$/,
	ADDRESS_REGEX: /^[A-Za-z0-9\s.,'-]+$/
};

// Security utility functions
const sanitizeInput = (input) => {
	if (typeof input !== 'string') return input;
	return input.replace(/[<>]/g, '');
};

const validateName = (name) => {
	if (!name) return true;
	return VALIDATION.NAME_REGEX.test(name) && name.length <= VALIDATION.NAME_MAX_LENGTH;
};

const validateAddress = (address) => {
	if (!address) return true;
	return VALIDATION.ADDRESS_REGEX.test(address) && address.length <= VALIDATION.ADDRESS_MAX_LENGTH;
};

const validateZipCode = (zipcode) => {
	if (!zipcode) return true;
	return VALIDATION.ZIPCODE_REGEX.test(zipcode) && zipcode.length <= VALIDATION.ZIPCODE_MAX_LENGTH;
};

const Profile = () => {
	const [cookies] = useCookies("userSession");
	const [data, setData] = useState(null);
	const [loginButtonSpinner, setLoginButtonSpinner] = useState(false);
	const secretKey = cookies.userSession.USER_KEY;

	const [serverErrorResponse, setServerErrorResponse] = useState({
		serverErrorCode: "",
		serverErrorSubject: "",
		serverErrorMessage: "",
		errServMsgShow: false
	});

	const [serverSuccessResponse, setServerSuccessResponse] = useState({
		ui_subject: "",
		ui_message: "",
		succServMsgShow: false
	});

	const [validationErrors, setValidationErrors] = useState({
		firstname: false,
		middlename: false,
		lastname: false,
		address1: false,
		address2: false,
		city: false,
		state: false,
		province: false,
		zipcode: false,
		country: false
	});

	const [pageFields, setPageFields] = useState({
		firstname: "",
		middlename: "",
		lastname: "",
		address1: "",
		address2: "",
		city: "",
		state: "",
		province: "",
		zipcode: "",
		country: "",
		privacy: false
	});

	async function SetFormData(result) {
		setPageFields(prevState => { return { ...prevState, firstname: result.firstname } });
		setPageFields(prevState => { return { ...prevState, middlename: result.middlename } });
		setPageFields(prevState => { return { ...prevState, lastname: result.lastname } });
		setPageFields(prevState => { return { ...prevState, address1: result.address1 } });
		setPageFields(prevState => { return { ...prevState, address2: result.address2 } });
		setPageFields(prevState => { return { ...prevState, city: result.city } });
		setPageFields(prevState => { return { ...prevState, state: result.state } });
		setPageFields(prevState => { return { ...prevState, province: result.province } });
		setPageFields(prevState => { return { ...prevState, zipcode: result.zipcode } });
		setPageFields(prevState => { return { ...prevState, country: result.country } });
		if (result.privacy === 0) {
			setPageFields(prevState => { return { ...prevState, privacy: false } });
		} else if (result.privacy === 1) {
			setPageFields(prevState => { return { ...prevState, privacy: true } });
		}
	}

	const getPrivacy = () => {
		if (pageFields.privacy === true) {
			return 1;
		} else if (pageFields.privacy === false) {
			return 0;
		}
	}

	async function ApplyUserData() {
		try {
			const cachedData = localStorage.getItem("cachedUserData");
			if (cachedData) {
				let cache = JSON.parse(Lock("decrypt", cachedData, secretKey));
				setData(cache);
				await SetFormData(cache);
			} else {
				await FetchLatestUserData();
			}
		} catch (error) {
			console.log(error);
		}
	}

	async function FetchLatestUserData() {
		let userKey = cookies.userSession.USER_KEY;
		let deviceKey = cookies.userSession.DEVICE_KEY;
		let sessionKey = cookies.userSession.SESSION_KEY;

		var cookieData = {
			userKey,
			deviceKey,
			sessionKey
		};

		console.log(cookieData);
		let headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.FETCH_PROFILE };
		const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, cookieData, { headers: headers })
			.then((response) => { return response })
			.catch((error) => { return error; });

		console.log(result);

		if (result.status !== 200) {
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorCode: result.status } });
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorSubject: result.statusText } });
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorMessage: result.message } });
			setServerErrorResponse(prevState => { return { ...prevState, errServMsgShow: true } });
			return;
		}

		if (result.data.ERROR_MSG_TYPE === constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE) {
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorCode: result.data.ERROR_FIELD_CODE } });
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorSubject: result.data.ERROR_FIELD_SUBJECT } });
			setServerErrorResponse(prevState => { return { ...prevState, serverErrorMessage: result.data.ERROR_FIELD_MESSAGE } });
			setServerErrorResponse(prevState => { return { ...prevState, errServMsgShow: true } });
			setData(" ");
			return;
		}

		localStorage.setItem('cachedUserData', Lock("encrypt", JSON.stringify(result.data), secretKey));
		setData(JSON.parse(JSON.stringify(result.data)));
		SetFormData(result.data);
	}

	const CheckNullException = (value, option) => {
		if (value === null) {
			return option;
		} else if (typeof (value) === Object) {
			return option;
		} else if (value === undefined) {
			return option;
		} else if (value === "") {
			return option;
		}
		else {
			return value;
		}
	}

	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => { ApplyUserData() }, []);

	if (!data) {
		return (
			<div class="text-center">
				<div class="spinner-border" role="status">
					<span class="visually-hidden">Loading...</span>
				</div>
			</div>
		);
	}

	const Clear = () => {
		document.getElementById("UserProfileForm").reset();
		const cachedData = localStorage.getItem("cachedUserData");
		let result = JSON.parse(Lock("decrypt", cachedData, secretKey));
		setPageFields(prevState => { return { ...prevState, firstname: result.firstname } });
		setPageFields(prevState => { return { ...prevState, middlename: result.middlename } });
		setPageFields(prevState => { return { ...prevState, lastname: result.lastname } });
		setPageFields(prevState => { return { ...prevState, address1: result.address1 } });
		setPageFields(prevState => { return { ...prevState, address2: result.address2 } });
		setPageFields(prevState => { return { ...prevState, city: result.city } });
		setPageFields(prevState => { return { ...prevState, state: result.state } });
		setPageFields(prevState => { return { ...prevState, province: result.province } });
		setPageFields(prevState => { return { ...prevState, zipcode: result.zipcode } });
		setPageFields(prevState => { return { ...prevState, country: result.country } });
		if (result.privacy === 0) {
			setPageFields(prevState => { return { ...prevState, privacy: false } });
		} else if (result.privacy === 1) {
			setPageFields(prevState => { return { ...prevState, privacy: true } });
		}
	}

	const validateForm = () => {
		const errors = {
			firstname: !validateName(pageFields.firstname),
			middlename: !validateName(pageFields.middlename),
			lastname: !validateName(pageFields.lastname),
			address1: !validateAddress(pageFields.address1),
			address2: !validateAddress(pageFields.address2),
			city: !validateName(pageFields.city),
			state: !validateName(pageFields.state),
			province: !validateName(pageFields.province),
			zipcode: !validateZipCode(pageFields.zipcode),
			country: !validateName(pageFields.country)
		};

		setValidationErrors(errors);
		return !Object.values(errors).some(error => error);
	};

	const handleInputChange = (field, value) => {
		const sanitizedValue = sanitizeInput(value);
		setPageFields(prevState => ({ ...prevState, [field]: sanitizedValue }));
		
		// Clear validation error when user starts typing
		if (validationErrors[field]) {
			setValidationErrors(prevState => ({ ...prevState, [field]: false }));
		}
	};

	const Update = async () => {
		if (!validateForm()) {
			setServerErrorResponse(prevState => ({
				...prevState,
				serverErrorCode: "Validation Error",
				serverErrorSubject: "Invalid Input",
				serverErrorMessage: "Please check the form for errors",
				errServMsgShow: true
			}));
			return;
		}

		setLoginButtonSpinner(true);

		try {
			const postData = {
				userKey: cookies.userSession.USER_KEY,
				deviceKey: cookies.userSession.DEVICE_KEY,
				sessionKey: cookies.userSession.SESSION_KEY,
				firstname: pageFields.firstname,
				middlename: pageFields.middlename,
				lastname: pageFields.lastname,
				address1: pageFields.address1,
				address2: pageFields.address2,
				city: pageFields.city,
				state: pageFields.state,
				province: pageFields.province,
				country: pageFields.country,
				zipcode: pageFields.zipcode,
				privacy: getPrivacy()
			};

			const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.EDIT_PROFILE };
			const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, postData, { headers });

			if (result.status !== 200) {
				setServerErrorResponse(prevState => ({
					...prevState,
					serverErrorCode: result.status,
					serverErrorSubject: result.statusText,
					serverErrorMessage: result.message,
					errServMsgShow: true
				}));
				return;
			}

			if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.MSG_TYPE) {
				setServerErrorResponse(prevState => ({
					...prevState,
					serverErrorCode: result.data.ERROR_FIELD_CODE,
					serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
					serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
					errServMsgShow: true
				}));
				return;
			}

			localStorage.removeItem('cachedUserData');
			const storeData = {
				firstname: pageFields.firstname,
				middlename: pageFields.middlename,
				lastname: pageFields.lastname,
				address1: pageFields.address1,
				address2: pageFields.address2,
				city: pageFields.city,
				state: pageFields.state,
				province: pageFields.province,
				country: pageFields.country,
				zipcode: pageFields.zipcode,
				privacy: pageFields.privacy
			};
			localStorage.setItem('cachedUserData', Lock("encrypt", JSON.stringify(storeData), secretKey));

			if (result.data.MSG_TYPE === constants.SUCCESS_MESSAGE.TYPE_EDIT_USER_DATA) {
				setServerSuccessResponse(prevState => ({
					...prevState,
					ui_subject: result.data.UI_SUBJECT,
					ui_message: result.data.UI_MESSAGE,
					succServMsgShow: true
				}));
				Clear();
			}
		} catch (error) {
			setServerErrorResponse(prevState => ({
				...prevState,
				serverErrorCode: "Network Error",
				serverErrorSubject: "Connection Error",
				serverErrorMessage: "Unable to connect to the server. Please try again later.",
				errServMsgShow: true
			}));
		} finally {
			setLoginButtonSpinner(false);
		}
	};

	return (
		<div id="ProfileContent">
			<h1>Profile</h1>

			<Form id="UserProfileForm">
				<Row>
					<Col>
						<Form.Check type="switch" id="privacySwitch" label="Set Account Privacy" className="mb-3" checked={pageFields.privacy}
							onChange={(e) => setPageFields(prevState => ({ ...prevState, privacy: e.target.checked }))}
						/>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Username</Form.Label>
							<Form.Control type="text" placeholder={cookies.userSession.USERNAME} disabled />
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Email address</Form.Label>
							<Form.Control type="text" placeholder={cookies.userSession.EMAIL_ADDRESS} disabled />
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Label>First Name</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.firstname, "First Name")}
								value={pageFields.firstname}
								onChange={(e) => handleInputChange('firstname', e.target.value)}
								isInvalid={validationErrors.firstname}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid first name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Middle Name</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.middlename, "Middle Name")}
								value={pageFields.middlename}
								onChange={(e) => handleInputChange('middlename', e.target.value)}
								isInvalid={validationErrors.middlename}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid middle name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.lastname, "Last Name")}
								value={pageFields.lastname}
								onChange={(e) => handleInputChange('lastname', e.target.value)}
								isInvalid={validationErrors.lastname}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid last name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Address 1</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.address1, "Address 1")}
								value={pageFields.address1}
								onChange={(e) => handleInputChange('address1', e.target.value)}
								isInvalid={validationErrors.address1}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid address (letters, numbers, spaces, and basic punctuation only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Address 2</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.address2, "Address 2")}
								value={pageFields.address2}
								onChange={(e) => handleInputChange('address2', e.target.value)}
								isInvalid={validationErrors.address2}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid address (letters, numbers, spaces, and basic punctuation only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Label>City</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.city, "City")}
								value={pageFields.city}
								onChange={(e) => handleInputChange('city', e.target.value)}
								isInvalid={validationErrors.city}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid city name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>State</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.state, "State")}
								value={pageFields.state}
								onChange={(e) => handleInputChange('state', e.target.value)}
								isInvalid={validationErrors.state}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid state name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Province</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.province, "Province")}
								value={pageFields.province}
								onChange={(e) => handleInputChange('province', e.target.value)}
								isInvalid={validationErrors.province}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid province name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Zip code</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.zipcode, "Zip Code")}
								value={pageFields.zipcode}
								onChange={(e) => handleInputChange('zipcode', e.target.value)}
								isInvalid={validationErrors.zipcode}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid zip code (letters, numbers, spaces, and hyphens only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>

					<Col>
						<Form.Group className="mb-3">
							<Form.Label>Country</Form.Label>
							<Form.Control
								type="text"
								placeholder={CheckNullException(pageFields.country, "Country")}
								value={pageFields.country}
								onChange={(e) => handleInputChange('country', e.target.value)}
								isInvalid={validationErrors.country}
							/>
							<Form.Control.Feedback type="invalid">
								Please enter a valid country name (letters, spaces, hyphens, and apostrophes only)
							</Form.Control.Feedback>
						</Form.Group>
					</Col>
				</Row>

				<Row>
					<Col>
						<ButtonGroup size="md" className="mb-2">
							<Button variant="outline-primary" type="button" onClick={() => Update()}>
								{loginButtonSpinner && <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="false" />}
								Update
							</Button>
							<Button variant="outline-info" type="button" onClick={() => Clear()}>Clear</Button>
						</ButtonGroup>
					</Col>
				</Row>
			</Form>

			<Servererrormsg
				open={serverErrorResponse.errServMsgShow}
				onClose={() => setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: false }))}
				errorcode={serverErrorResponse.serverErrorCode}
				errorsubject={serverErrorResponse.serverErrorSubject}
				errormessage={serverErrorResponse.serverErrorMessage}
			/>

			<ServerSuccessMsg
				open={serverSuccessResponse.succServMsgShow}
				onClose={() => setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: false }))}
				ui_subject={serverSuccessResponse.ui_subject}
				ui_message={serverSuccessResponse.ui_message}
			/>
		</div>
	);
};
  
export default Profile;