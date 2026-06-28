import { describe, it, expect } from 'vitest';
import Lock from '../encryption';

describe('Lock (encryption module)', () => {
    const testKey = 'test-secret-key-123';

    describe('encrypt', () => {
        it('encrypts a string value', () => {
            const result = Lock('encrypt', 'hello', testKey);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
            expect(result).not.toBe('hello');
        });

        it('encrypts an object value', () => {
            const obj = { username: 'john', id: 42 };
            const result = Lock('encrypt', obj, testKey);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('encrypts an array value', () => {
            const arr = [1, 2, 3];
            const result = Lock('encrypt', arr, testKey);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });

        it('produces different ciphertext for different keys', () => {
            const value = 'secret data';
            const result1 = Lock('encrypt', value, 'key-one');
            const result2 = Lock('encrypt', value, 'key-two');
            expect(result1).not.toBe(result2);
        });
    });

    describe('decrypt', () => {
        it('decrypts an encrypted string back to original', () => {
            const original = 'hello world';
            const encrypted = Lock('encrypt', original, testKey);
            const decrypted = Lock('decrypt', encrypted, testKey);
            expect(decrypted).toBe(original);
        });

        it('decrypts an encrypted object back to original', () => {
            const original = { name: 'test', value: 123, nested: { a: true } };
            const encrypted = Lock('encrypt', original, testKey);
            const decrypted = Lock('decrypt', encrypted, testKey);
            expect(decrypted).toEqual(original);
        });

        it('decrypts an encrypted array back to original', () => {
            const original = [1, 'two', { three: 3 }];
            const encrypted = Lock('encrypt', original, testKey);
            const decrypted = Lock('decrypt', encrypted, testKey);
            expect(decrypted).toEqual(original);
        });

        it('throws an error when decrypting with wrong key', () => {
            const encrypted = Lock('encrypt', 'secret', testKey);
            expect(() => Lock('decrypt', encrypted, 'wrong-key')).toThrow('Failed to decrypt data');
        });

        it('throws an error when decrypting invalid data', () => {
            expect(() => Lock('decrypt', 'not-valid-ciphertext', testKey)).toThrow('Failed to decrypt data');
        });

        it('throws an error when decrypting empty string', () => {
            expect(() => Lock('decrypt', '', testKey)).toThrow('Failed to decrypt data');
        });
    });

    describe('invalid type', () => {
        it('throws an error for unknown type', () => {
            expect(() => Lock('hash', 'value', testKey)).toThrow('Invalid Lock type: "hash"');
        });

        it('throws an error for empty type', () => {
            expect(() => Lock('', 'value', testKey)).toThrow('Invalid Lock type: ""');
        });

        it('throws an error for undefined type', () => {
            expect(() => Lock(undefined, 'value', testKey)).toThrow('Invalid Lock type');
        });
    });
});
