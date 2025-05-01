import React, { useState, useEffect } from "react";
import { Modal, Button, ListGroup, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaUserPlus, FaUserCheck, FaUserTimes, FaUserFriends } from 'react-icons/fa';
import { useCookies } from "react-cookie";
import '../sass/requests.sass';

const Requests = ({ show, handleClose }) => {
    const [cookies] = useCookies("userSession");
    const [requests, setRequests] = useState({
        friendRequests: [],
        followerRequests: []
    });
    const [loading, setLoading] = useState(true);

    const secretKey = cookies.userSession.USER_KEY;
    const sessionKey = cookies.userSession.SESSION_KEY;
    const deviceKey = cookies.userSession.DEVICE_KEY;

    useEffect(() => {
        if (show) {
            fetchRequests();
        }
    }, [show]);

    const fetchRequests = async () => {
        setLoading(true);
        // Mock data - replace with actual API call
        const mockRequests = {
            friendRequests: [
                { id: 1, username: 'john_doe', firstName: 'John', lastName: 'Doe', type: 'friend' },
                { id: 2, username: 'jane_smith', firstName: 'Jane', lastName: 'Smith', type: 'friend' }
            ],
            followerRequests: [
                { id: 3, username: 'bob_wilson', firstName: 'Bob', lastName: 'Wilson', type: 'follower' },
                { id: 4, username: 'alice_brown', firstName: 'Alice', lastName: 'Brown', type: 'follower' }
            ]
        };
        setRequests(mockRequests);
        setLoading(false);
    };

    const handleAccept = (request) => {
        console.log('Accept request:', request);
        // Implement accept functionality
    };

    const handleDecline = (request) => {
        console.log('Decline request:', request);
        // Implement decline functionality
    };

    const RequestItem = ({ request }) => (
        <ListGroup.Item className="request-item">
            <div className="d-flex justify-content-between align-items-center">
                <div className="request-info">
                    <h6 className="mb-0">{request.firstName} {request.lastName}</h6>
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
                        >
                            <FaUserCheck />
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
                        >
                            <FaUserTimes />
                        </Button>
                    </OverlayTrigger>
                </div>
            </div>
        </ListGroup.Item>
    );

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Requests</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center p-4">
                        <div className="spinner-border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="requests-container">
                        <div className="request-section mb-4">
                            <h5 className="mb-3">
                                <FaUserFriends className="me-2" />
                                Friend Requests
                                <Badge bg="primary" className="ms-2">
                                    {requests.friendRequests.length}
                                </Badge>
                            </h5>
                            <ListGroup>
                                {requests.friendRequests.map(request => (
                                    <RequestItem key={request.id} request={request} />
                                ))}
                                {requests.friendRequests.length === 0 && (
                                    <ListGroup.Item className="text-center text-muted">
                                        No friend requests
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </div>

                        <div className="request-section">
                            <h5 className="mb-3">
                                <FaUserPlus className="me-2" />
                                Follower Requests
                                <Badge bg="primary" className="ms-2">
                                    {requests.followerRequests.length}
                                </Badge>
                            </h5>
                            <ListGroup>
                                {requests.followerRequests.map(request => (
                                    <RequestItem key={request.id} request={request} />
                                ))}
                                {requests.followerRequests.length === 0 && (
                                    <ListGroup.Item className="text-center text-muted">
                                        No follower requests
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </div>
                    </div>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default Requests; 