import { describe, it, expect, beforeEach } from 'vitest';
import Conn from '../conn';

describe('Conn (connection configuration)', () => {
    beforeEach(() => {
        Conn.setServer(null);
    });

    describe('SERVERS', () => {
        it('contains an array of server URLs', () => {
            expect(Array.isArray(Conn.SERVERS)).toBe(true);
            expect(Conn.SERVERS.length).toBeGreaterThan(0);
        });

        it('all server URLs end with a slash', () => {
            Conn.SERVERS.forEach(url => {
                expect(url.endsWith('/')).toBe(true);
            });
        });

        it('all server URLs start with http:// or https://', () => {
            Conn.SERVERS.forEach(url => {
                expect(url).toMatch(/^https?:\/\//);
            });
        });
    });

    describe('setServer / getServer', () => {
        it('returns null when no server is set', () => {
            expect(Conn.getServer()).toBeNull();
        });

        it('stores and returns the selected server', () => {
            const url = 'http://example.com/';
            Conn.setServer(url);
            expect(Conn.getServer()).toBe(url);
        });

        it('overwrites the previously selected server', () => {
            Conn.setServer('http://first.com/');
            Conn.setServer('http://second.com/');
            expect(Conn.getServer()).toBe('http://second.com/');
        });
    });

    describe('URL getters', () => {
        it('returns null for all URLs when no server is set', () => {
            expect(Conn.URL.JPUBLIC_URL).toBeNull();
            expect(Conn.URL.JUSER_URL).toBeNull();
            expect(Conn.URL.JSOCIAL_URL).toBeNull();
            expect(Conn.URL.JSUPPORT_URL).toBeNull();
            expect(Conn.URL.JDRIVE_URL).toBeNull();
            expect(Conn.URL.JADMIN_URL).toBeNull();
        });

        it('returns correct URLs when server is set', () => {
            Conn.setServer('http://localhost:8080/');
            expect(Conn.URL.JPUBLIC_URL).toBe('http://localhost:8080/jpublic/');
            expect(Conn.URL.JUSER_URL).toBe('http://localhost:8080/juser/');
            expect(Conn.URL.JSOCIAL_URL).toBe('http://localhost:8080/jsocial/');
            expect(Conn.URL.JSUPPORT_URL).toBe('http://localhost:8080/jsupport/');
            expect(Conn.URL.JDRIVE_URL).toBe('http://localhost:8080/jdrive/');
            expect(Conn.URL.JADMIN_URL).toBe('http://localhost:8080/jadmin/');
        });

        it('dynamically reflects server changes', () => {
            Conn.setServer('http://server1.com/');
            expect(Conn.URL.JUSER_URL).toBe('http://server1.com/juser/');

            Conn.setServer('http://server2.com/');
            expect(Conn.URL.JUSER_URL).toBe('http://server2.com/juser/');
        });
    });

    describe('CONTENT_TYPE', () => {
        it('has JSON content type header', () => {
            expect(Conn.CONTENT_TYPE.CONTENT_JSON).toEqual({
                'Content-type': 'application/json'
            });
        });
    });

    describe('SERVICE_HEADERS', () => {
        it('has all required service headers defined', () => {
            const expectedHeaders = [
                'USER_LOGIN', 'CREATE_NEW_USER', 'EDIT_PROFILE', 'FETCH_PROFILE',
                'USER_LOGOFF', 'REVIEW_US', 'CONTACT_SUPPORT', 'VALIDATE_SESSION',
                'SEARCH_USERS', 'USER_FILE_UPLOAD', 'USER_DIR_UPDATE',
                'USER_FILE_DELETE', 'USER_FILE_DOWNLOAD', 'CHANGE_PASSWORD',
                'DEACTIVATE_USER', 'SEND_FRIEND_REQUEST', 'GET_FRIEND_REQUEST_LIST',
                'GET_FOLLOW_LIST', 'GET_FOLLOWER_REQUEST_LIST', 'SEND_FOLLOW_REQUEST',
                'ACCEPT_FRIEND_REQUEST', 'ACCEPT_FOLLOW_REQUEST',
                'REJECT_FRIEND_REQUEST', 'REJECT_FOLLOW_REQUEST',
                'BLOCK_USER', 'GET_FRIEND_LIST', 'GET_BLOCK_USER_LIST',
                'REMOVE_FOLLOWER', 'UN_FRIEND', 'UN_FOLLOW',
                'VIEW_USER_PROFILE', 'UNBLOCK_USER'
            ];
            expectedHeaders.forEach(header => {
                expect(Conn.SERVICE_HEADERS[header]).toBeDefined();
                expect(Conn.SERVICE_HEADERS[header]).toHaveProperty('Service-Header');
            });
        });

        it('each service header has a non-empty string value', () => {
            Object.values(Conn.SERVICE_HEADERS).forEach(header => {
                expect(typeof header['Service-Header']).toBe('string');
                expect(header['Service-Header'].length).toBeGreaterThan(0);
            });
        });
    });
});
