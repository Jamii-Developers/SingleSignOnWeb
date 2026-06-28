import React from 'react';
import { Container, Row, Col, Card, Form, Button, ButtonGroup, Spinner } from 'react-bootstrap';
import { useState } from "react";
import { FaStar, FaUser, FaEnvelope } from 'react-icons/fa';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import FieldValidationError from '../../components/FieldValidationError';
import apiRequest from '../../utils/apiRequest';
import { validateMinLength } from '../../utils/validators';
import conn from "../../configs/conn";
import constants from "../../utils/constants";
import '../sass/clientcommunication.sass';

const Reviewus = () => {
    const { cookies, getSessionData, getUserInfo } = useSessionCredentials();
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
        document.getElementById("ReviewUs").reset();
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
            showError("", "Thought Input Error!", "Your thoughts are empty, please share your thoughts");
            return;
        }

        if (pageFields.thoughts.length < 5) {
            showError("", "Thought Input Error!", "Your thoughts are empty, please share your thoughts");
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
            const { success } = await apiRequest(
                conn.URL.JSUPPORT_URL,
                contactUsJSON,
                conn.SERVICE_HEADERS.REVIEW_US,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_REVIEWUS,
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

            <ServerResponseModals />
        </div>
    );
};

export default Reviewus;
