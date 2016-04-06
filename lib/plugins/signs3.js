'use strict';

const aws = require('aws-sdk');

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
                        console.log('REQUEST', request.query);
                        const s3 = new aws.S3();

                        const s3_params = {
                            Bucket: process.env.BUCKET,
                            Key: request.query.file_name,
                            Expires: 60,
                            ContentType: request.query.file_type,
                            ACL: 'public-read'
                        };

                        s3.getSignedUrl('putObject', s3_params, (err, data) => {
                            if (err) {
                                console.log(err);
                            } else {
                                console.log('DATA', data);
                                var return_data = {
                                    signed_request: data,
                                    url: 'https://' + process.env.BUCKET + '.s3.amazonaws.com/' + request.query.file_name
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
