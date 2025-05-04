import React, { useState, useEffect } from 'react';
import { ListGroup, Button, Container, Row, Col } from 'react-bootstrap';
import { FaArrowLeft, FaUserSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import JsonNetworkAdapter from '../../configs/networkadapter';
import conn from '../../configs/conn';
import constants from '../../utils/constants';
import ServerErrorMsg from '../../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../../frequentlyUsedModals/serversuccessmsg';

const BlockedList = () => {
    const [cookies] = useCookies("userSession");
    const navigate = useNavigate();
    const [blockedUsers, setBlockedUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingUnblock, setProcessingUnblock] = useState(new Set());

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

    const fetchBlockedUsers = async () => {
        try {
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.GET_BLOCK_USER_LIST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, requestData, { headers });
            console.log(result.data);
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
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to fetch blocked users",
                errServMsgShow: true
            }));
        } finally {
            setLoading(false);
        }
    };

    const handleUnblock = async (userId) => {
        try {
            setProcessingUnblock(prev => new Set([...prev, userId]));
            const requestData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                targetUserKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.UNBLOCK_USER };
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

                setBlockedUsers(prev => prev.filter(user => user.id !== userId));
            }
        } catch (error) {
            console.error('Error unblocking user:', error);
            setServerErrorResponse(prevState => ({
                ...prevState,
                serverErrorCode: "ERR|001",
                serverErrorSubject: "Error",
                serverErrorMessage: "Failed to unblock user",
                errServMsgShow: true
            }));
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
                            <div className="text-center p-4">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
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

export default BlockedList;