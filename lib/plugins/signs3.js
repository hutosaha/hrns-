'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.register = (server, options, next) => {

        server.route({
                method: 'GET',
                path: '/sign_s3',
                config: {
                    auth: {
                        strategy: 'hrns-cookie',
                        scope: 'agency'
                    },
                    handler: (request, reply) => {
                        const s3 = new aws.S3();
                        const uniqueFilename = uuid.v1() + '-' + request.query.file_name;
                        const s3_params = {
                            Bucket: process.env.BUCKET,
                            Key: uniqueFilename,
                            Expires: 60,
                            ContentType: request.query.file_type,
                            ACL: 'public-read'
                        };

                        s3.getSignedUrl('putObject', s3_params, (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                let return_data = {
                                      signed_request: data,
                                      url: 'https://' + process.env.BUCKET + '.s3.amazonaws.com/' + uniqueFilename
                                    };
                                reply(JSON.stringify(return_data));
                            }
                        });
                    }
                  }
                });
    return next();
};

exports.register.attributes = {
    name: 'SignS3'
};
