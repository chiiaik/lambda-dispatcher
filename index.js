const _ = require('lodash');
const AWS = require('aws-sdk');

module.exports = {
    dispatch: function (fnNameOrArn, invocationType, payload) {
        if (_.isEmpty(fnNameOrArn)) {
            return Promise.reject(new Error('missing lambda function name or ARN'));
        }
        if (_.isEmpty(invocationType) && _.isEmpty(payload)) {
            return Promise.reject(new Error('missing payload'));
        }
        let aType, aPayload;
        if (invocationType && payload) {
            aType = invocationType;
            aPayload = payload;
        } else {
            aType = 'Event';
            aPayload = invocationType;
        }
        return new Promise(function(resolve, reject) {
            let params = {
                FunctionName: fnNameOrArn,
                InvocationType: aType,
                Payload: JSON.stringify(aPayload),
            };
            new AWS.Lambda().invoke(params, function(error, data) {
                if (error) {
                    return reject(error);
                }
                resolve(data);
            });
        });
    }
}
