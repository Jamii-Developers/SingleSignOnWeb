import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaUserSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useServerResponse from '../../hooks/useServerResponse';
import useSessionCredentials from '../../hooks/useSessionCredentials';
import apiRequest from '../../utils/apiRequest';
import LoadingSpinner from '../../components/LoadingSpinner';
import conn from '../../configs/conn';
import constants from '../../utils/constants';

const BlockedList = () => {
    const navigate = useNavigate();
    const { getSessionData } = useSessionCredentials();
    const { showError, showSuccess, ServerResponseModals } = useServerResponse();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingUnblock, setProcessingUnblock] = useState(new Set());

    const fetchBlockedUsers = async () => {
        try {
            const requestData = getSessionData();

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.GET_BLOCK_USER_LIST,
                { showError }
            );

            if (success) {
                const formattedUsers = result.data.results.map(user => ({
                    id: user.userKey,
                    username: user.username,
                    firstName: user.firstname === 'N/A' ? '' : user.firstname,
                    lastName: user.lastname === 'N/A' ? '' : user.lastname
                }));
                setBlockedUsers(formattedUsers);
            }
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            showError("ERR|001", "Error", "Failed to fetch blocked users");
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId) => {
        try {
            setProcessingUnblock(prev => new Set([...prev, userId]));
            const requestData = {
                ...getSessionData(),
                targetUserKey: userId
            };

            const { success } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                requestData,
                conn.SERVICE_HEADERS.UNBLOCK_USER,
                {
                    showError,
                    showSuccess,
                    onSuccess: () => {
                        setBlockedUsers(prev => prev.filter(user => user.id !== userId));
                    }
                }
            );
        } catch (error) {
            console.error('Error unblocking user:', error);
            showError("ERR|001", "Error", "Failed to unblock user");
        } finally {
            setProcessingUnblock(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        }
    };

    useEffect(() => {
        fetchBlockedUsers();
    }, []);

    return (
        <Container fluid className="blocked-list-page">
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
                        <h2 className="mb-0">Blocked Users</h2>
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
                                {blockedUsers.map(user => (
                                    <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-0">
                                                {user.firstName && user.lastName 
                                                    ? `${user.firstName} ${user.lastName}`.trim()
                                                    : user.username}
                                            </h6>
                                            <small className="text-muted">@{user.username}</small>
                                        </div>
                                        <Button
                                            variant="outline-danger"
                                            size="sm"
                                            onClick={() => handleUnblock(user.id)}
                                            disabled={processingUnblock.has(user.id)}
                                        >
                                            {processingUnblock.has(user.id) ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            ) : (
                                                <>
                                                    <FaUserSlash className="me-1" />
                                                    Unblock
                                                </>
                                            )}
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                                {blockedUsers.length === 0 && (
                                    <ListGroup.Item className="text-center text-muted">
                                        No blocked users
                                    </ListGroup.Item>
                                )}
                            </>
                        )}
                    </ListGroup>
                </Col>
            </Row>

            <ServerResponseModals />
        </Container>
    );
};

export default BlockedList;
