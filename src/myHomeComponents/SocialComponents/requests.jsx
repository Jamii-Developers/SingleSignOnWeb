import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Container, Row, Col, Badge, ButtonGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaArrowLeft, FaCheck, FaTimes, FaBan, FaUserPlus, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import apiRequest from '../../utils/apiRequest';
import LoadingSpinner from '../../components/LoadingSpinner';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ViewUserProfile from './ViewUserProfile';

const Requests = () => {
    const navigate = useNavigate();
    const { getSessionData } = useSessionCredentials();
    const { showError, showSuccess, ServerResponseModals } = useServerResponse();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingActions, setProcessingActions] = useState({
        accept: new Set(),
        reject: new Set(),
        block: new Set()
    });

    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);

    const fetchRequests = async () => {
        try {
            const requestData = getSessionData();

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.GET_FRIEND_REQUEST_LIST,
                { showError }
            );

            if (success) {
                const formattedRequests = result.data.results.map(user => ({
                    id: user.userKey,
                    username: user.username,
                    firstName: user.firstname === 'N/A' ? '' : user.firstname,
                    lastName: user.lastname === 'N/A' ? '' : user.lastname,
                    requestDate: user.requestDate
                }));
                setRequests(formattedRequests);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
            showError("ERR|001", "Error", "Failed to fetch friend requests");
        } finally {
            setLoading(false);
        }
    };

    const handleViewProfile = async (userId) => {
        setSelectedUserId(userId);
        setShowProfileModal(true);
    };

    const handleAccept = async (userId) => {
        try {
            setProcessingActions(prev => ({
                ...prev,
                accept: new Set([...prev.accept, userId])
            }));

            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.ACCEPT_FRIEND_REQUEST,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_ACCEPT_FRIEND_REQUEST,
                    onSuccess: () => {
                        setRequests(prev => prev.filter(req => req.id !== userId));
                    }
                }
            );
        } catch (error) {
            console.error('Error accepting request:', error);
            showError("ERR|001", "Error", "Failed to accept friend request");
        } finally {
            setProcessingActions(prev => ({
                ...prev,
                accept: new Set([...prev.accept].filter(id => id !== userId))
            }));
        }
    };

    const handleReject = async (userId) => {
        try {
            setProcessingActions(prev => ({
                ...prev,
                reject: new Set([...prev.reject, userId])
            }));

            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.REJECT_FRIEND_REQUEST,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_REJECT_FRIEND_REQUEST,
                    onSuccess: () => {
                        setRequests(prev => prev.filter(req => req.id !== userId));
                    }
                }
            );
        } catch (error) {
            console.error('Error rejecting request:', error);
            showError("ERR|001", "Error", "Failed to reject friend request");
        } finally {
            setProcessingActions(prev => ({
                ...prev,
                reject: new Set([...prev.reject].filter(id => id !== userId))
            }));
        }
    };

    const handleBlock = async (userId) => {
        try {
            setProcessingActions(prev => ({
                ...prev,
                block: new Set([...prev.block, userId])
            }));

            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.BLOCK_USER,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_BLOCK_USER_REQUEST,
                    onSuccess: () => {
                        setRequests(prev => prev.filter(req => req.id !== userId));
                    }
                }
            );
        } catch (error) {
            console.error('Error blocking user:', error);
            showError("ERR|001", "Error", "Failed to block user");
        } finally {
            setProcessingActions(prev => ({
                ...prev,
                block: new Set([...prev.block].filter(id => id !== userId))
            }));
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

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
                        <h2 className="mb-0">
                            Friend Requests
                            {requests.length > 0 && (
                                <Badge bg="primary" className="ms-2" pill>
                                    {requests.length}
                                </Badge>
                            )}
                        </h2>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col>
                    <ListGroup>
                        {loading ? (
                            <LoadingSpinner className="text-center p-4" />
                        ) : (
                            <>
                                {requests.map(request => (
                                    <ListGroup.Item key={request.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0">
                                                {request.firstName && request.lastName 
                                                    ? `${request.firstName} ${request.lastName}`.trim()
                                                    : request.username}
                                            </h6>
                                            <small className="text-muted">@{request.username}</small>
                                        </div>
                                        <ButtonGroup>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>View Profile</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    onClick={() => handleViewProfile(request.id)}
                                                    disabled={
                                                        processingActions.accept.has(request.id) ||
                                                        processingActions.reject.has(request.id) ||
                                                        processingActions.block.has(request.id)
                                                    }
                                                >
                                                    <FaUser />
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Accept</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-success"
                                                    size="sm"
                                                    onClick={() => handleAccept(request.id)}
                                                    disabled={
                                                        processingActions.accept.has(request.id) ||
                                                        processingActions.reject.has(request.id) ||
                                                        processingActions.block.has(request.id)
                                                    }
                                                >
                                                    {processingActions.accept.has(request.id) ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FaCheck />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Reject</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => handleReject(request.id)}
                                                    disabled={
                                                        processingActions.accept.has(request.id) ||
                                                        processingActions.reject.has(request.id) ||
                                                        processingActions.block.has(request.id)
                                                    }
                                                >
                                                    {processingActions.reject.has(request.id) ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FaTimes />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger
                                                placement="top"
                                                overlay={<Tooltip>Block</Tooltip>}
                                            >
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => handleBlock(request.id)}
                                                    disabled={
                                                        processingActions.accept.has(request.id) ||
                                                        processingActions.reject.has(request.id) ||
                                                        processingActions.block.has(request.id)
                                                    }
                                                >
                                                    {processingActions.block.has(request.id) ? (
                                                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                                    ) : (
                                                        <FaBan />
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                        </ButtonGroup>
                                    </ListGroup.Item>
                                ))}
                                {requests.length === 0 && (
                                    <ListGroup.Item className="text-center text-muted">
                                        No pending friend requests
                                    </ListGroup.Item>
                                )}
                            </>
                        )}
                    </ListGroup>
                </Col>
            </Row>

            <ViewUserProfile
                show={showProfileModal}
                onHide={() => setShowProfileModal(false)}
                userId={selectedUserId}
            />

            <ServerResponseModals />
        </Container>
    );
};

export default Requests;
