import CryptoJS from 'crypto-js';

const Lock = (type, value, key) => {
    if (type === "encrypt") {
        return CryptoJS.AES.encrypt(JSON.stringify(value), key).toString();
    }

    if (type === "decrypt") {
        try {
            const bytes = CryptoJS.AES.decrypt(value, key);
            const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
            if (!decryptedString) {
                throw new Error("Decryption produced empty result — key may be wrong or data is corrupt");
            }
            return JSON.parse(decryptedString);
        } catch (error) {
            throw new Error("Failed to decrypt data: " + error.message);
        }
    }

    throw new Error(`Invalid Lock type: "${type}". Expected "encrypt" or "decrypt".`);
};

export default Lock;

