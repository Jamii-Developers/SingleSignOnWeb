import { describe, it, expect } from 'vitest';
import Constants from '../constants';

describe('Constants', () => {
    describe('SUCCESS_MESSAGE', () => {
        it('has all success message codes defined', () => {
            expect(Constants.SUCCESS_MESSAGE).toBeDefined();
            expect(typeof Constants.SUCCESS_MESSAGE).toBe('object');
        });

        it('all success codes follow SUC|NNN pattern', () => {
            Object.values(Constants.SUCCESS_MESSAGE).forEach(code => {
                expect(code).toMatch(/^SUC\|\d{3}$/);
            });
        });

        it('has unique success codes', () => {
            const codes = Object.values(Constants.SUCCESS_MESSAGE);
            const uniqueCodes = new Set(codes);
            expect(uniqueCodes.size).toBe(codes.length);
        });

        it('contains expected user login code', () => {
            expect(Constants.SUCCESS_MESSAGE.TYPE_USERLOGIN).toBe('SUC|001');
        });

        it('contains expected create new user code', () => {
            expect(Constants.SUCCESS_MESSAGE.TYPE_CREATE_NEW_USER).toBe('SUC|002');
        });

        it('contains expected logoff code', () => {
            expect(Constants.SUCCESS_MESSAGE.TYPE_LOGOFF).toBe('SUC|024');
        });

        it('contains social-related success codes', () => {
            expect(Constants.SUCCESS_MESSAGE.TYPE_SEND_FRIEND_REQUEST).toBe('SUC|009');
            expect(Constants.SUCCESS_MESSAGE.TYPE_SEND_FOLLOW_REQUEST).toBe('SUC|010');
            expect(Constants.SUCCESS_MESSAGE.TYPE_ACCEPT_FRIEND_REQUEST).toBe('SUC|011');
            expect(Constants.SUCCESS_MESSAGE.TYPE_ACCEPT_FOLLOW_REQUEST).toBe('SUC|012');
            expect(Constants.SUCCESS_MESSAGE.TYPE_REJECT_FRIEND_REQUEST).toBe('SUC|013');
            expect(Constants.SUCCESS_MESSAGE.TYPE_REJECT_FOLLOW_REQUEST).toBe('SUC|014');
        });

        it('contains file management success codes', () => {
            expect(Constants.SUCCESS_MESSAGE.TYPE_EDIT_USER_DATA).toBe('SUC|003');
            expect(Constants.SUCCESS_MESSAGE.TYPE_CHANGE_PASSWORD).toBe('SUC|004');
        });
    });

    describe('ERROR_MESSAGE', () => {
        it('has error message codes defined', () => {
            expect(Constants.ERROR_MESSAGE).toBeDefined();
            expect(typeof Constants.ERROR_MESSAGE).toBe('object');
        });

        it('error codes follow ERR|NNN pattern', () => {
            Object.values(Constants.ERROR_MESSAGE).forEach(code => {
                expect(code).toMatch(/^ERR\|\d{3}$/);
            });
        });

        it('contains expected error message code', () => {
            expect(Constants.ERROR_MESSAGE.TYPE_ERROR_MESSAGE).toBe('ERR|001');
        });
    });
});
