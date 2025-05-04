import React, { useState, useEffect } from "react";
import { Button, ListGroup, Badge, OverlayTrigger, Tooltip, Container, Row, Col, Nav, Tab, ButtonGroup } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaUserFriends, FaArrowLeft, FaUser, FaBan } from 'react-icons/fa';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import '../sass/requests.sass';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

const Requests = () => {
    const [cookies] = useCookies("userSession");
    const navigate = useNavigate();
    const [requests, setRequests] = useState({
        friendRequests: [],
        followerRequests: []
    });

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

    const [loading, setLoading] = useState(true);
    const [processingRequests, setProcessingRequests] = useState(new Set());

    const fetchRequests = async () => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            // Fetch friend requests first
            const friendHeaders = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FRIEND_REQUEST_LIST };
            const friendResult = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers: friendHeaders });

            if (friendResult.status === 200) {
                if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE !== friendResult.data.ERROR_MSG_TYPE) {
                    if (constants.SUCCESS_MESSAGE.TYPE_GET_FRIEND_REQUEST_LIST_REQUEST === friendResult.data.MSG_TYPE) {
                        setServerSuccessResponse(prevState => ({
                            ...prevState,
                            ui_subject: friendResult.data.UI_SUBJECT,
                            ui_message: friendResult.data.UI_MESSAGE,
                            succServMsgShow: true   
                        }));
                    }

                    const formattedFriendRequests = friendResult.data.results.map(request => ({
                        id: request.userKey,
                        username: request.username,
                        name: request.firstname === 'N/A' || request.lastname === 'N/A' 
                            ? request.username 
                            : `${request.firstname} ${request.lastname}`.trim(),
                        type: 'friend'
                    }));
                    setRequests(prev => ({ ...prev, friendRequests: formattedFriendRequests }));
                }
            }

            // Then fetch follower requests
            const followerHeaders = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FOLLOWER_REQUEST_LIST };
            const followerResult = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers: followerHeaders });

            if (followerResult.status === 200) {
                if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE !== followerResult.data.ERROR_MSG_TYPE) {
                    const formattedFollowerRequests = followerResult.data.results.map(request => ({
                        id: request.userKey,
                        username: request.username,
                        name: request.firstname === 'N/A' || request.lastname === 'N/A' 
                            ? request.username 
                            : `${request.firstname} ${request.lastname}`.trim(),
                        type: 'follower'
                    }));
                    setRequests(prev => ({ ...prev, followerRequests: formattedFollowerRequests }));
                }
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests(prev => ({ 
                ...prev, 
                friendRequests: [], 
                followerRequests: [] 
            }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAccept = async (request) => {
        try {
            setProcessingRequests(prev => new Set([...prev, request.id]));
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: request.id
            };

            let headers;
            if (request.type === 'friend') {
                headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.ACCEPT_FRIEND_REQUEST };
            } else {
                headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.ACCEPT_FOLLOW_REQUEST };
            }

            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });

            if (result.status === 200) {
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

                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));

                if (request.type === 'friend') {
                    setRequests(prev => ({
                        ...prev,
                        friendRequests: prev.friendRequests.filter(req => req.id !== request.id)
                    }));
                } else {
                    setRequests(prev => ({
                        ...prev,
                        followerRequests: prev.followerRequests.filter(req => req.id !== request.id)
                    }));
                }
            }
        } catch (error) {
            console.error('Error accepting request:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to accept request",
                errServMsgShow: true
            }));
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(request.id);
                return newSet;
            });
        }
    };

    const handleDecline = async (request) => {
        try {
            setProcessingRequests(prev => new Set([...prev, request.id]));
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: request.id
            };

            let headers;
            if (request.type === 'friend') {
                headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REJECT_FRIEND_REQUEST };
            } else {
                headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.REJECT_FOLLOW_REQUEST };
            }

            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });

            if (result.status === 200) {
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

                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));

                if (request.type === 'friend') {
                    setRequests(prev => ({
                        ...prev,
                        friendRequests: prev.friendRequests.filter(req => req.id !== request.id)
                    }));
                } else {
                    setRequests(prev => ({
                        ...prev,
                        followerRequests: prev.followerRequests.filter(req => req.id !== request.id)
                    }));
                }
            }
        } catch (error) {
            console.error('Error declining request:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to decline request",
                errServMsgShow: true
            }));
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(request.id);
                return newSet;
            });
        }
    };

    const RequestList = ({ requests, type }) => (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
            {loading ? (
                <Col xs={12} className="text-center p-4">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </Col>
            ) : (
                <>
                    {requests.map(request => (
                        <Col key={request.id}>
                            <div className="user-card p-3 border rounded h-100">
                                <div className="d-flex flex-column h-100">
                                    <div className="mb-3">
                                        <h6 className="mb-1">
                                            {request.name}
                                        </h6>
                                        <small className="text-muted">@{request.username}</small>
                                    </div>
                                    <div className="mt-auto">
                                        <ButtonGroup className="w-100">
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>View Profile</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => navigate(`/profile/${request.id}`)}
                                                >
                                                    <FaUser />
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Accept Request</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleAccept(request)}
                                                    disabled={processingRequests.has(request.id)}
                                                >
                                                    {processingRequests.has(request.id) ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FaUserCheck />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Decline Request</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleDecline(request)}
                                                    disabled={processingRequests.has(request.id)}
                                                >
                                                    {processingRequests.has(request.id) ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FaUserTimes />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Block User</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleBlock(request.id)}
                                                >
                                                    <FaBan />
                                                </Button>
                                            </OverlayTrigger>
                                        </ButtonGroup>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    ))}
                    {requests.length === 0 && (
                        <Col xs={12}>
                            <div className="text-center text-muted p-4 border rounded">
                                No {type} requests found
                            </div>
                        </Col>
                    )}
                </>
            )}
        </Row>
    );

    return (
        <Container fluid className="requests-page">
            <Row className="mb-4">
                <Col>
                    <div className="d-flex align-items-center">
                        <Button 
                            variant="link" 
                            className="back-button me-3" 
                            onClick={() => navigate(-1)}
                        >
                            <FaArrowLeft />
                        </Button>
                        <h2 className="mb-0">Requests</h2>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Tab.Container defaultActiveKey="friend-requests">
                        <Nav variant="tabs" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="friend-requests">
                                    <FaUserFriends className="me-2" />
                                    Friend Requests
                                    <Badge bg="primary" className="ms-2">
                                        {requests.friendRequests.length}
                                    </Badge>
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="follower-requests">
                                    <FaUserPlus className="me-2" />
                                    Follower Requests
                                    <Badge bg="primary" className="ms-2">
                                        {requests.followerRequests.length}
                                    </Badge>
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Tab.Content>
                            <Tab.Pane eventKey="friend-requests">
                                <RequestList requests={requests.friendRequests} type="friend" />
                            </Tab.Pane>
                            <Tab.Pane eventKey="follower-requests">
                                <RequestList requests={requests.followerRequests} type="follower" />
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                </Col>
            </Row>

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
        </Container>
    );
};

export default Requests; 