import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Dropdown, Spinner, Button } from 'react-bootstrap';
import { FaSearch, FaFile, FaUser, FaFolder, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import JsonNetworkAdapter from '../configs/networkadapter';
import conn from '../configs/conn';
import '../sass/globalsearch.sass';
import constants from '../utils/constants';
import ServerErrorMsg from '../frequentlyUsedModals/servererrormsg';
import ServerSuccessMsg from '../frequentlyUsedModals/serversuccessmsg';

const GlobalSearch = () => {
    const [cookies] = useCookies("userSession");
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        // Cleanup timeout on component unmount
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
        };
    }, []);

    const handleSearch = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchSearchResults(query);
            setSearchResults(response);
        } catch (error) {
            console.error('Search error:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSearchResults = async (query) => {
        const searchData = {
            deviceKey: cookies.userSession.DEVICE_KEY,
            userKey: cookies.userSession.USER_KEY,
            sessionKey: cookies.userSession.SESSION_KEY,
            searchstring: query
        };

        try {
            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.SEARCH_USERS };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, searchData, { headers });
            console.log(result);
            if (result.status !== 200) {
                throw new Error(result.statusText);
            }

            if (result.data.ERROR_MSG_TYPE === constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE) {
                throw new Error(result.data.ERROR_FIELD_MESSAGE);
            }

            console.log(result.data.results);
            // Transform the response data into the expected format
            return result.data.results.map(user => ({
                id: user.userKey,
                type: 'user',
                name: user.firstname === 'N/A' || user.lastname === 'N/A' 
                    ? user.username 
                    : `${user.firstname} ${user.lastname}`.trim(),
                username: user.username,
                path: `/myhome/social/friends`,
                icon: <FaUser className="text-primary" />,
                isOnline: false,
                isFriend: user.friend ,
                isFollowing: user.following,
                hasPendingFriendRequest: user.hasPendingFriendRequest,
                hasPendingFollowingRequest: user.hasPendingFollowingRequest
            }));
        } catch (error) {
            console.error('Search API error:', error);
            return [];
        }
    };

    const handleAddFriend = async (userId) => {
        try {
            // Set loading state for this specific button
            setLoadingStates(prev => ({ ...prev, [`friend-${userId}`]: true }));

            const friendData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                friendKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.SEND_FRIEND_REQUEST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, friendData, { headers });

            if (result.status === 200) {
                // Update the UI to reflect the new friend status
                setSearchResults(prevResults => 
                    prevResults.map(result => 
                        result.id === userId 
                            ? { ...result, hasPendingFriendRequest: true, isFriend: false }
                            : result
                    )
                );
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

            if (constants.SUCCESS_MESSAGE.TYPE_SEND_FRIEND_REQUEST === result.data.MSG_TYPE) {
                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));
            }
        } catch (error) {
            console.error('Error adding friend:', error);
        } finally {
            // Clear loading state for this button
            setLoadingStates(prev => ({ ...prev, [`friend-${userId}`]: false }));
        }
    };

    const handleFollow = async (userId) => {
        try {
            // Set loading state for this specific button
            setLoadingStates(prev => ({ ...prev, [`follow-${userId}`]: true }));

            const followData = {
                deviceKey: cookies.userSession.DEVICE_KEY,
                userKey: cookies.userSession.USER_KEY,
                sessionKey: cookies.userSession.SESSION_KEY,
                followKey: userId
            };

            const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.SEND_FOLLOW_REQUEST };
            const result = await JsonNetworkAdapter.post(conn.URL.USER_URL, followData, { headers });
            console.log(result);
            if (result.status === 200) {
                // Update the UI to reflect the new following status
                setSearchResults(prevResults => 
                    prevResults.map(result => 
                        result.id === userId 
                            ? { ...result, hasPendingFollowingRequest: true, isFollowing: false }
                            : result
                    )
                );
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

            if (constants.SUCCESS_MESSAGE.TYPE_SEND_FOLLOW_REQUEST === result.data.MSG_TYPE) {
                setServerSuccessResponse(prevState => ({
                    ...prevState,
                    ui_subject: result.data.UI_SUBJECT,
                    ui_message: result.data.UI_MESSAGE,
                    succServMsgShow: true
                }));
            }
        } catch (error) {
            console.error('Error following user:', error);
        } finally {
            // Clear loading state for this button
            setLoadingStates(prev => ({ ...prev, [`follow-${userId}`]: false }));
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowResults(true);

        // Debounce search
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        searchTimeout.current = setTimeout(() => {
            handleSearch(query);
        }, 300);
    };

    const handleResultClick = (result) => {
        if (result.type === 'user') {
            navigate(`/myhome/social/profile/${result.id}`);
        } else {
            navigate(result.path);
        }
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.global-search-container')) {
            setShowResults(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="global-search-container">
            <InputGroup>
                <InputGroup.Text>
                    <FaSearch />
                </InputGroup.Text>
                <Form.Control
                    type="search"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSearch(searchQuery);
                            setShowResults(true);
                        }
                    }}
                    onFocus={() => setShowResults(true)}
                />
            </InputGroup>

            {showResults && (searchQuery || isLoading) && (
                <div className="search-results">
                    {isLoading ? (
                        <div className="loading-state">
                            <Spinner animation="border" size="sm" />
                            <span>Searching...</span>
                        </div>
                    ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                            <div
                                key={result.id}
                                className="search-result-item"
                            >
                                <div 
                                    className="result-content"
                                    onClick={() => handleResultClick(result)}
                                >
                                    <div className="result-icon">
                                        {result.icon}
                                    </div>
                                    <div className="result-info">
                                        <div className="result-name">
                                            {result.name}
                                            <span className="username">@{result.username}</span>
                                        </div>
                                        <div className="result-type">
                                            {result.isOnline && (
                                                <span className="status-badge online">Online</span>
                                            )}
                                            {result.hasPendingFriendRequest ? (
                                                <span className="status-badge pending-friend">Friend Request Pending</span>
                                            ) : result.isFriend ? (
                                                <span className="status-badge friend">Friend</span>
                                            ) : (
                                                <span className="status-badge not-friend">Not in friendlist</span>
                                            )}
                                            {result.hasPendingFollowingRequest ? (
                                                <span className="status-badge pending-follow">Follow Request Pending</span>
                                            ) : result.isFollowing ? (
                                                <span className="status-badge following">Following</span>
                                            ) : (
                                                <span className="status-badge not-following">Not following</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {result.type === 'user' && (
                                    <div className="result-actions">
                                        {!result.hasPendingFriendRequest && !result.isFriend && (
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                onClick={() => handleAddFriend(result.id)}
                                                className="action-button"
                                                disabled={loadingStates[`friend-${result.id}`]}
                                            >
                                                {loadingStates[`friend-${result.id}`] ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="ms-2">Adding...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserPlus /> Add Friend
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                        {!result.hasPendingFollowingRequest && !result.isFollowing && (
                                            <Button
                                                variant="outline-secondary"
                                                size="sm"
                                                onClick={() => handleFollow(result.id)}
                                                className="action-button"
                                                disabled={loadingStates[`follow-${result.id}`]}
                                            >
                                                {loadingStates[`follow-${result.id}`] ? (
                                                    <>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        />
                                                        <span className="ms-2">Following...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaUserCheck /> Follow
                                                    </>
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            No users found
                        </div>
                    )}
                </div>
            )}

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

export default GlobalSearch; 