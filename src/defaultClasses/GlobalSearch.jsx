import React, { useState, useEffect, useRef } from 'react';
import { Form, InputGroup, Spinner, Button } from 'react-bootstrap';
import { FaSearch, FaUser, FaUserPlus, FaUserCheck } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import useServerResponse from '../hooks/useServerResponse';
import useSessionCredentials from '../hooks/useSessionCredentials';
import apiRequest from '../utils/apiRequest';
import JsonNetworkAdapter from '../configs/networkadapter';
import conn from '../configs/conn';
import constants from '../utils/constants';
import '../sass/globalsearch.sass';

const GlobalSearch = () => {
    const { getSessionData } = useSessionCredentials();
    const { showError, showSuccess, ServerResponseModals } = useServerResponse();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [loadingStates, setLoadingStates] = useState({});
    const searchTimeout = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
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
            showError("Search Error", "Search Failed", error.message || "Unable to complete search. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSearchResults = async (query) => {
        const searchData = {
            ...getSessionData(),
            searchstring: query
        };

        const headers = { ...conn.CONTENT_TYPE.CONTENT_JSON, ...conn.SERVICE_HEADERS.SEARCH_USERS };
        const result = await JsonNetworkAdapter.post(conn.URL.JUSER_URL, searchData, { headers });

        if (result.status !== 200) {
            throw new Error(result.statusText);
        }

        if (result.data.ERROR_MSG_TYPE === constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE) {
            throw new Error(result.data.ERROR_FIELD_MESSAGE);
        }

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
            isFriend: user.friend,
            isFollowing: user.following,
            hasPendingFriendRequest: user.hasPendingFriendRequest,
            hasPendingFollowingRequest: user.hasPendingFollowingRequest
        }));
    };

    const handleAddFriend = async (userId) => {
        try {
            setLoadingStates(prev => ({ ...prev, [`friend-${userId}`]: true }));

            const friendData = {
                ...getSessionData(),
                friendKey: userId
            };

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                friendData,
                conn.SERVICE_HEADERS.SEND_FRIEND_REQUEST,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_SEND_FRIEND_REQUEST,
                    onSuccess: () => {
                        setSearchResults(prevResults =>
                            prevResults.map(r =>
                                r.id === userId
                                    ? { ...r, hasPendingFriendRequest: true, isFriend: false }
                                    : r
                            )
                        );
                    }
                }
            );
        } catch (error) {
            console.error('Error adding friend:', error);
            showError("Network Error", "Friend Request Failed", "Unable to send friend request. Please try again.");
        } finally {
            setLoadingStates(prev => ({ ...prev, [`friend-${userId}`]: false }));
        }
    };

    const handleFollow = async (userId) => {
        try {
            setLoadingStates(prev => ({ ...prev, [`follow-${userId}`]: true }));

            const followData = {
                ...getSessionData(),
                followKey: userId
            };

            const { success, result } = await apiRequest(
                conn.URL.JSOCIAL_URL,
                followData,
                conn.SERVICE_HEADERS.SEND_FOLLOW_REQUEST,
                {
                    showError,
                    showSuccess,
                    successMsgType: constants.SUCCESS_MESSAGE.TYPE_SEND_FOLLOW_REQUEST,
                    onSuccess: () => {
                        setSearchResults(prevResults =>
                            prevResults.map(r =>
                                r.id === userId
                                    ? { ...r, hasPendingFollowingRequest: true, isFollowing: false }
                                    : r
                            )
                        );
                    }
                }
            );
        } catch (error) {
            console.error('Error following user:', error);
            showError("Network Error", "Follow Request Failed", "Unable to send follow request. Please try again.");
        } finally {
            setLoadingStates(prev => ({ ...prev, [`follow-${userId}`]: false }));
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setShowResults(true);
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

            <ServerResponseModals />
        </div>
    );
};

export default GlobalSearch; 
