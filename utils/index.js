import validator from 'validator';
import error from 'restify-errors';

const validateEmails = (emails) => {
    const isInvalidPayload = !Array.isArray(emails);
    const allAreNotValidEmails = !isEmailValid(isInvalidPayload ? [] : emails);
    const lesserTwoEmails = emails.length < 2;
    if (isInvalidPayload || allAreNotValidEmails || lesserTwoEmails) {
        let msg = 'Invalid friends payload.';
        if (allAreNotValidEmails) {
            msg = 'Invalid email on one of the friends payload.'
        }
        if (lesserTwoEmails) {
            msg = 'Insufficient number of email addresses supplied.'
        }
        throw new Error(msg);
    }
}

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email address.');
    }
}

const isEmailValid = (emails) => {
    for (let email of emails) {
        if (!validator.isEmail(email)) {
            return false;
        }
    }
    return true;
}

const restifyErrorWrapper = (res, e) => {
    if (e instanceof error.RestError) {
        res.send(e);
    } else {
        res.send(
            new error.BadRequestError({ cause: e }, 'Unexpected error.')
        );
    }
}

const throwNotFoundError = (field) => {
    throw new error
        .ResourceNotFoundError(`Resource not found.${field ? ' --' + field : ''}`);
}

module.exports = {
    validateEmails,
    validateEmail,
    isEmailValid,
    restifyErrorWrapper,
    throwNotFoundError

}