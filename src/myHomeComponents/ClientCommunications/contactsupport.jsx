import React from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { useState } from "react";
import { FaHeadset, FaUser, FaEnvelope } from 'react-icons/fa';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import FieldValidationError from '../../components/FieldValidationError';
import apiRequest from '../../utils/apiRequest';
import { validateMinLength } from '../../utils/validators';
import conn from "../../configs/conn";
import constants from "../../utils/constants";
import '../sass/clientcommunication.sass';

const Contactsupport = () => {
    const { cookies, getSessionData } = useSessionCredentials();
    const { showError, showSuccess, showNetworkError, ServerResponseModals } = useServerResponse();

    const [pageFields, setPageFields] = useState({
        email: cookies.userSession.EMAIL_ADDRESS,
        username: cookies.userSession.USERNAME,
        thoughts: ""
    });

    const [errordata, setErrorData] = useState({
        thoughtsErrorTrigger: false,
        thoughtsErrorMessage: ""
    });

    const [submitThoughtsButtonSpinner, setSubmitThoughtsButtonSpinner] = useState(false);

    function clear() {
        document.getElementById("ContactSupportForm").reset();
        setPageFields(prevState => ({ ...prevState, thoughts: "" }));
    }

    function CheckThoughts(thoughts) {
        const result = validateMinLength(thoughts, 5, "Thoughts");
        if (!result.valid) {
            setErrorData(prevState => ({
                ...prevState,
                thoughtsErrorMessage: thoughts === "" ? "Please share your thoughts as this is blank currently" : result.message,
                thoughtsErrorTrigger: true
            }));
            return;
        }
        setErrorData(prevState => ({ ...prevState, thoughtsErrorTrigger: false }));
    }

    async function submitThoughts() {
        if (pageFields.thoughts === "") {
            showError("Generated at ContactUsJS", "Thought Input Error!", "Your thoughts are empty, please share your thoughts");
            return;
        }

        if (pageFields.thoughts.length < 5) {
            showError("Generated at ContactUsJS", "Thought Input Error!", "Your thoughts are empty, please share your thoughts");
            return;
        }

        const contactUsJSON = {
            ...getSessionData(),
            emailaddress: cookies.userSession.EMAIL_ADDRESS,
            username: cookies.userSession.USERNAME,
            client_thoughts: pageFields.thoughts,
        };

        setSubmitThoughtsButtonSpinner(true);

        try {
            await apiRequest(
                conn.URL.JSUPPORT_URL,
                contactUsJSON,
                conn.SERVICE_HEADERS.CONTACT_SUPPORT,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_CONTACTSUPPORT,
                    onSuccess: () => clear()
                }
            );
        } catch (error) {
            showNetworkError();
        } finally {
            setSubmitThoughtsButtonSpinner(false);
        }
    }

    return (
        <div id="ContactSupportContent">
            <Container>
                <Card className="mb-4">
                    <Card.Body>
                        <Form id="ContactSupportForm">
                            <Row className="mb-4">
                                <Col>
                                    <div className="d-flex align-items-center">
                                        <FaHeadset className="me-2 text-primary" size={24} />
                                        <h1 className="mb-0">Contact Support</h1>
                                    </div>
                                    <p className="text-muted mt-2">
                                        If you are having issues with some functionalities at within JamiiX feel free to share your issue and we will get back to you within 24-48 hrs.
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
                                        <Form.Label>Share your issue here</Form.Label>
                                        <Form.Control
                                            id="thoughts"
                                            as="textarea"
                                            placeholder="Describe your issue in detail..."
                                            style={{ height: '150px' }}
                                            onInput={(e) => setPageFields(prevState => ({ ...prevState, thoughts: e.target.value }))}
                                            onChange={(e) => CheckThoughts(e.target.value)}
                                        />
                                    </Form.Group>
                                    <FieldValidationError show={errordata.thoughtsErrorTrigger} message={errordata.thoughtsErrorMessage} />
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
                                            Submit Issue
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

            <ServerResponseModals />
        </div>
    );
};

export default Contactsupport;
