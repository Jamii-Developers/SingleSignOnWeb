const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{5,}$/;
const SPECIAL_CHARS = /[`!@#$%^&*()_\-+=[\]{};':"|,.<>/?~ ]/;
const PASSWORD_MIN_LENGTH = 8;
const USERNAME_MIN_LENGTH = 5;

const DISPOSABLE_EMAIL_DOMAINS = ['tempmail.com', 'throwawaymail.com', 'mailinator.com'];

const validateEmail = (email) => {
    if (!email) return { valid: false, message: "Email address is required" };
    if (!EMAIL_REGEX.test(email)) return { valid: false, message: "Please enter a valid email address (e.g., user@example.com)" };

    const domain = email.split('@')[1];
    if (DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
        return { valid: false, message: "Please use a valid email address. Disposable email addresses are not allowed." };
    }

    return { valid: true, message: "" };
};

const validateUsername = (username) => {
    if (!username) return { valid: false, message: "Username is required" };
    if (username.length < USERNAME_MIN_LENGTH) return { valid: false, message: `Username cannot be less than ${USERNAME_MIN_LENGTH} characters` };
    if (username.match(SPECIAL_CHARS)) return { valid: false, message: "Your username cannot contain any special characters" };
    return { valid: true, message: "" };
};

const validatePassword = (password) => {
    if (!password) return { valid: false, message: "Password is required" };
    if (password.length < PASSWORD_MIN_LENGTH) return { valid: false, message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long` };
    return { valid: true, message: "" };
};

const validateLoginCredential = (credential) => {
    if (!credential) return { valid: false, message: "Please enter your email address or username" };

    const isEmail = EMAIL_REGEX.test(credential);
    const isUsername = USERNAME_REGEX.test(credential);

    if (!isEmail && !isUsername) {
        return { valid: false, message: "Please enter a valid email address or username" };
    }

    return { valid: true, message: "" };
};

const validatePasswordMatch = (password, retypedPassword) => {
    if (!retypedPassword) return { valid: false, message: "Please re-type your password" };
    if (password !== retypedPassword) return { valid: false, message: "The passwords do not match" };
    return { valid: true, message: "" };
};

const validateMinLength = (value, minLength, fieldName) => {
    if (!value) return { valid: false, message: `${fieldName} is required` };
    if (value.length < minLength) return { valid: false, message: `Please enter more than ${minLength} characters.` };
    return { valid: true, message: "" };
};

export {
    EMAIL_REGEX,
    USERNAME_REGEX,
    SPECIAL_CHARS,
    PASSWORD_MIN_LENGTH,
    USERNAME_MIN_LENGTH,
    DISPOSABLE_EMAIL_DOMAINS,
    validateEmail,
    validateUsername,
    validatePassword,
    validateLoginCredential,
    validatePasswordMatch,
    validateMinLength
};
