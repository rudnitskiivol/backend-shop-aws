import basicAuthorizer from './handler';

const createEventObject = (token, type = 'TOKEN') => ({ authorizationToken: token, type: type});

const mockCallback = (error = null, policy = null) => {
    return {
        error: error,
        policy: policy
    }
}

const USER_NAME = 'USER_NAME';
const USER_PASSWORD = 'USER_PASSWORD';
const AUTH_TYPE = 'Basic ';

process.env[USER_NAME] = USER_PASSWORD;

const encodeCredentials = (name, password, separator = ':'): string => {
    const credentials = name + separator + password;
    return Buffer.from(credentials, 'utf8').toString('base64');
}

describe('basicAuthorizer test suite', () => {
    test.each`
      userName    | userPassword | expected
      ${USER_NAME} | ${USER_PASSWORD} | ${'Allow'} 
      ${USER_NAME} | ${'WRONG_PASSWORD'} | ${'Deny'}
      ${'WRONG_USER_NAME'} | ${USER_PASSWORD} | ${'Deny'}
    `('Test credentials check', ({userName, userPassword, expected}) => {
        const testSuiteToken = AUTH_TYPE + encodeCredentials(userName, userPassword);
        const { error, policy } = basicAuthorizer(createEventObject(testSuiteToken), null, mockCallback);
        expect(error).toBeNull();
        console.log(policy.policyDocument.Statement[0]);
        expect(policy.policyDocument.Statement[0].Effect).toBe(expected);
    });

    it('Wrong user name [Deny]', async () => {
        const testSuiteToken = AUTH_TYPE + encodeCredentials('WRONG_USERNAME', USER_PASSWORD);
        const { error, policy } = await basicAuthorizer(createEventObject(testSuiteToken), null, mockCallback);
        expect(error).toBeNull();
        expect(policy.policyDocument.Statement[0].Effect).toBe('Deny');
    });

    it('Wrong auth header type [Unauthorized]', async () => {
        const testSuiteToken = 'Bearer ' + encodeCredentials(USER_NAME, USER_PASSWORD);
        const { error } = await basicAuthorizer(createEventObject(testSuiteToken), null, mockCallback);
        expect(error).toBe('Unauthorized');
    });

    it('Wrong type [Unauthorized]', async () => {
        const testSuiteToken = AUTH_TYPE + encodeCredentials(USER_NAME, USER_PASSWORD, );
        const { error } = await basicAuthorizer(createEventObject(testSuiteToken, 'RESOURCE'), null, mockCallback);
        expect(error).toBe('Unauthorized');
    });
});
