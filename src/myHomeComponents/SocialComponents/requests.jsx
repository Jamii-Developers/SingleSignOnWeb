import React, { useState, useEffect } from "react";
import { Button, ListGroup, Badge, OverlayTrigger, Tooltip, Container, Row, Col } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaUserFriends, FaArrowLeft } from 'react-icons/fa';
import { useCookies } from "react-cookie";
import { useNavigate } from 'react-router-dom';
import '../sass/requests.sass';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/ServerErrorMsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/ServerSuccessMsg';

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

    const fetchFriendRequests = async () => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FRIEND_REQUEST_LIST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log(result.data);

            if (result.status === 200 ) {

                if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                    return;
                }
                
                if (constants.SUCCESS_MESSAGE.TYPE_GET_FRIEND_REQUEST_LIST_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true   
                    }));
                }

                const formattedRequests = result.data.results.map(request => ({
                    id: request.userKey,
                    username: request.username,
                    name: request.firstname === 'N/A' || request.lastname === 'N/A' 
                        ? request.username 
                        : `${request.firstname} ${request.lastname}`.trim(),
                    type: 'friend'
                }));
                setRequests(prev => ({ ...prev, friendRequests: formattedRequests }));
            } else {
                setRequests(prev => ({ ...prev, friendRequests: [] }));
            }
        } catch (error) {
            console.error('Error fetching friend requests:', error);
            setRequests(prev => ({ ...prev, friendRequests: [] }));
        } finally {
            setLoading(false);
        }
    };

    const fetchFollowRequests = async () => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_FOLLOWER_REQUEST_LIST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });

            if (result.status === 200 ) {

                if (constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE === result.data.ERROR_MSG_TYPE) {
                    return;
                }

                const formattedRequests = result.data.results.map(request => ({
                    id: request.userKey,
                    username: request.username,
                    name: request.firstname === 'N/A' || request.lastname === 'N/A' 
                        ? request.username 
                        : `${request.firstname} ${request.lastname}`.trim(),
                    type: 'follower'
                }));
                setRequests(prev => ({ ...prev, followerRequests: formattedRequests }));
            } else {
                setRequests(prev => ({ ...prev, followerRequests: [] }));
            }
        } catch (error) {
            console.error('Error fetching follow requests:', error);
            setRequests(prev => ({ ...prev, followerRequests: [] }));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFriendRequests();
        fetchFollowRequests();
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
            console.log(requestData);
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log(result);

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
                
                if (constants.SUCCESS_MESSAGE.TYPE_ACCEPT_FOLLOW_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true
                    }));
                } 

                if (constants.SUCCESS_MESSAGE.TYPE_ACCEPT_FRIEND_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true
                    }));
                }

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
            } else {
                console.error('Failed to accept request:', result.data);
            }
        } catch (error) {
            console.error('Error accepting request:', error);
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
            console.log(result);

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

                if (constants.SUCCESS_MESSAGE.TYPE_REJECT_FRIEND_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true
                    }));
                }

                if (constants.SUCCESS_MESSAGE.TYPE_REJECT_FOLLOW_REQUEST === result.data.MSG_TYPE) {
                    setServerSuccessResponse(prevState => ({
                        ...prevState,
                        ui_subject: result.data.UI_SUBJECT,
                        ui_message: result.data.UI_MESSAGE,
                        succServMsgShow: true
                    }));

                    
                } else {
                    setRequests(prev => ({
                        ...prev,
                        followerRequests: prev.followerRequests.filter(req => req.id !== request.id)
                    }));
                }
            } else {
                console.error('Failed to decline request:', result.data);
            }
        } catch (error) {
            console.error('Error declining request:', error);
        } finally {
            setProcessingRequests(prev => {
                const newSet = new Set(prev);
                newSet.delete(request.id);
                return newSet;
            });
        }
    };

    const RequestItem = ({ request }) => {
        const isProcessing = processingRequests.has(request.id);
        
        return (
            <ListGroup.Item className="request-item">
                <div className="d-flex justify-content-between align-items-center">
                    <div className="request-info">
                        <h6 className="mb-0">{request.name}</h6>
                        <small className="text-muted">@{request.username}</small>
                    </div>
                    <div className="request-actions">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Accept</Tooltip>}
                        >
                            <Button
                                variant="outline-success"
                                size="sm"
                                className="me-2"
                                onClick={() => handleAccept(request)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                ) : (
                                    <FaUserCheck />
                                )}
                            </Button>
                        </OverlayTrigger>
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Decline</Tooltip>}
                        >
                            <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleDecline(request)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                ) : (
                                    <FaUserTimes />
                                )}
                            </Button>
                        </OverlayTrigger>
                    </div>
                </div>
            </ListGroup.Item>
        );
    };

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
                <Col md={6} className="mb-4">
                    <div className="request-section">
                        <h5 className="mb-3">
                            <FaUserFriends className="me-2" />
                            Friend Requests
                            <Badge bg="primary" className="ms-2">
                                {requests.friendRequests.length}
                            </Badge>
                        </h5>
                        <ListGroup>
                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {requests.friendRequests.map(request => (
                                        <RequestItem key={request.id} request={request} />
                                    ))}
                                    {requests.friendRequests.length === 0 && (
                                        <ListGroup.Item className="text-center text-muted">
                                            No friend requests
                                        </ListGroup.Item>
                                    )}
                                </>
                            )}
                        </ListGroup>
                    </div>
                </Col>

                <Col md={6} className="mb-4">
                    <div className="request-section">
                        <h5 className="mb-3">
                            <FaUserPlus className="me-2" />
                            Follower Requests
                            <Badge bg="primary" className="ms-2">
                                {requests.followerRequests.length}
                            </Badge>
                        </h5>
                        <ListGroup>
                            {loading ? (
                                <div className="text-center p-4">
                                    <div className="spinner-border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {requests.followerRequests.map(request => (
                                        <RequestItem key={request.id} request={request} />
                                    ))}
                                    {requests.followerRequests.length === 0 && (
                                        <ListGroup.Item className="text-center text-muted">
                                            No follower requests
                                        </ListGroup.Item>
                                    )}
                                </>
                            )}
                        </ListGroup>
                    </div>
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