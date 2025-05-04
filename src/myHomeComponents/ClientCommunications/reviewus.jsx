import React from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { useCookies } from "react-cookie";
import { useState } from "react";
import { FaStar, FaUser, FaEnvelope } from 'react-icons/fa';
import { Collapse, Alert } from '@mui/material';
import JsonNetworkAdapter from "../../configs/networkadapter";
import ServerErrorMsg from "../../frequentlyUsedModals/servererrormsg";
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';
import conn from "../../configs/conn";
import constants from "../../utils/constants";
import '../sass/clientcommunication.sass';

const Reviewus = () => {
    const [cookies] = useCookies("userSession");
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

    const [pageFields, setPageFields] = useState({
        email: cookies.userSession.EMAIL_ADDRESS,
        username: cookies.userSession.USERNAME,
        thoughts: ""
    });

    const [errordata, setErrorData] = useState({
        emailErrorTrigger: false,
        emailErrorMessage: "",
        usernameErrorTrigger: false,
        usernameErrorMessage: "",
        thoughtsErrorTrigger: false,
        thoughtsErrorMessage: ""
    });

    const [submitThoughtsButtonSpinner, setSubmitThoughtsButtonSpinner] = useState(false);

    function clear() {
        document.getElementById("ReviewUs").reset();
        setPageFields(prevState => ({ ...prevState, thoughts: "" }));
    }

    function ShowThoughtsError() {
        return (
            <Collapse in={errordata.thoughtsErrorTrigger}>
                <Alert variant="filled" severity="warning" className='mb-3'>{errordata.thoughtsErrorMessage}</Alert>
            </Collapse>
        );
    }

    function CheckThoughts(thoughts) {
        if (thoughts === "") {
            setErrorData(prevState => ({ ...prevState, thoughtsErrorMessage: "Please share your thoughts as this is blank currently" }));
            setErrorData(prevState => ({ ...prevState, thoughtsErrorTrigger: true }));
            return;
        }

        if (pageFields.thoughts.length < 5) {
            setErrorData(prevState => ({ ...prevState, thoughtsErrorMessage: "Please enter more than 5 characters." }));
            setErrorData(prevState => ({ ...prevState, thoughtsErrorTrigger: true }));
            return;
        }

        setErrorData(prevState => ({ ...prevState, thoughtsErrorTrigger: false }));
    }

    async function submitThoughts() {
        if (pageFields.thoughts === "") {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorSubject: "Thought Input Error!",
                serverErrorMessage: "Your thoughts are empty, please share your thoughts",
                errServMsgShow: true
            }));
            return;
        }

        if (pageFields.thoughts.length < 5) {
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorSubject: "Thought Input Error!",
                serverErrorMessage: "Your thoughts are empty, please share your thoughts",
                errServMsgShow: true
            }));
            return;
        }

        const contactUsJSON = {
            userKey: cookies.userSession.USER_KEY,
            deviceKey: cookies.userSession.DEVICE_KEY,
            sessionKey: cookies.userSession.SESSION_KEY,
            emailaddress: cookies.userSession.EMAIL_ADDRESS,
            username: cookies.userSession.USERNAME,
            client_thoughts: pageFields.thoughts,
        };

        setSubmitThoughtsButtonSpinner(true);

        try {
            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REVIEW_US };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, contactUsJSON, { headers });

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

            if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                setServerErrorResponse(prevState => ({
                    ...prevState,
                    serverErrorCode: result.data.ERROR_FIELD_CODE,
                    serverErrorSubject: result.data.ERROR_FIELD_SUBJECT,
                    serverErrorMessage: result.data.ERROR_FIELD_MESSAGE,
                    errServMsgShow: true
                }));
                return;
            }

            if (constants.SUCCESS_MESSAGE.TYPE_REVIEWUS === result.data.MSG_TYPE) {
                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));
                clear();
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
            setSubmitThoughtsButtonSpinner(false);
        }
    }

    return (
        <div id="ReviewUsContent">
            <Container>
                <Card className="mb-4">
                    <Card.Body>
                        <Form id="ReviewUs">
                            <Row className="mb-4">
                                <Col>
                                    <div className="d-flex align-items-center">
                                        <FaStar className="me-2 text-primary" size={24} />
                                        <h1 className="mb-0">Review Us</h1>
                                    </div>
                                    <p className="text-muted mt-2">
                                        At Jamii developers as we aim to improve and grow our solutions we appreciate any feedback in form of complements or complaints provided to us.
                                    </p>
                                </Col>
                            </Row>

                            <Row className="mb-4">
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaEnvelope className="me-2" />
                                            Email Address
                                        </Form.Label>
                                        <Form.Control
                                            id="email"
                                            type="text"
                                            value={cookies.userSession.EMAIL_ADDRESS}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>
                                            <FaUser className="me-2" />
                                            Username
                                        </Form.Label>
                                        <Form.Control
                                            id="username"
                                            type="text"
                                            value={cookies.userSession.USERNAME}
                                            disabled
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Leave your thoughts here</Form.Label>
                                        <Form.Control
                                            id="thoughts"
                                            as="textarea"
                                            placeholder="Share your feedback, suggestions, or concerns..."
                                            style={{ height: '150px' }}
                                            onInput={(e) => setPageFields(prevState => ({ ...prevState, thoughts: e.target.value }))}
                                            onChange={(e) => CheckThoughts(e.target.value)}
                                        />
                                    </Form.Group>
                                    <ShowThoughtsError />
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <ButtonGroup size="md" className="mb-2">
                                        <Button
                                            variant="outline-primary"
                                            type="button"
                                            onClick={() => submitThoughts()}
                                            disabled={submitThoughtsButtonSpinner}
                                        >
                                            {submitThoughtsButtonSpinner && (
                                                <Spinner
                                                    as="span"
                                                    animation="grow"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="false"
                                                    className="me-2"
                                                />
                                            )}
                                            Submit Review
                                        </Button>
                                        <Button
                                            variant="outline-info"
                                            type="button"
                                            onClick={() => clear()}
                                        >
                                            Clear
                                        </Button>
                                    </ButtonGroup>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>

            <ServerErrorMsg
                show={serverErrorResponse.errServMsgShow}
                onClose={() => setServerErrorResponse(prevState => ({ ...prevState, errServMsgShow: false }))}
                subject={serverErrorResponse.serverErrorSubject}
                message={serverErrorResponse.serverErrorMessage}
            />

            <ServerSuccessMsg
                show={serverSuccessResponse.succServMsgShow}
                onClose={() => setServerSuccessResponse(prevState => ({ ...prevState, succServMsgShow: false }))}
                subject={serverSuccessResponse.ui_subject}
                message={serverSuccessResponse.ui_message}
            />
        </div>
    );
};

export default Reviewus;