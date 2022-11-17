const basicAuthorizer = (event, _ctx, cb) => {
    console.log('basicAuthorizer: ', event);

    if (event.type !== 'TOKEN') {
        return cb('Unauthorized');
    }

    try {
        const [prefix, credentials] = event.authorizationToken.split(" ");

        if (prefix !== 'Basic') {
            return cb('Unauthorized');
        }

        let effect = 'Allow';

        const plainCredentials = Buffer.from(credentials, 'base64')
            .toString('utf-8')
            .split(':');

        const userName = plainCredentials[0];
        const password = plainCredentials[1];

        if (!process.env[userName] || process.env[userName] !== password) {
            effect = 'Deny';
        }

        return cb(null, generatePolicy(credentials, event.methodArn, effect));
    } catch (e) {
        return cb('Unauthorized');
    }
};

function generatePolicy(principalId, resource, effect = 'Deny') {
    return {
        principalId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource
                },
            ]
        },
    };
}

export default basicAuthorizer;
