const isEmpty = require('lodash.isempty');
const AWS = require('aws-sdk');

function LambdaDispatcher(config) {
    this.config = config;
}

LambdaDispatcher.prototype.dispatch = function (fnNameOrArn, invocationType, payload) {
    if (isEmpty(fnNameOrArn)) {
        return Promise.reject(new Error('missing lambda function name or ARN'));
    }
    if (isEmpty(invocationType) && isEmpty(payload)) {
        return Promise.reject(new Error('missing payload'));
    }
    let self = this;
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
        new AWS.Lambda(self.config).invoke(params, function(error, data) {
            if (error) {
                return reject(error);
            }
            resolve(data);
        });
    });
}

module.exports = LambdaDispatcher;
