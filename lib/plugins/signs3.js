'use strict';

const aws = require('aws-sdk');
const uuid = require('uuid');
const unoconv = require('unoconv');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.register = (server, options, next) => {

    const s3 = new aws.S3();
    const uniqueFilename = uuid.v1() + '-' + request.query.file_name;
    const s3_params = {
        Bucket: process.env.BUCKET,
        Key: uniqueFilename,
        Expires: 60,
        ContentType: request.query.file_type,
        ACL: 'public-read-write'
    };

    server.route([{
        method: 'GET',
        path: '/sign_s3',
        config: {
            auth: {
                strategy: 'hrns-cookie'
            },
            handler: (request, reply) => {
                const s3 = new aws.S3();
                const uniqueFilename = uuid.v1() + '-' + request.query.file_name;
                const s3_params = {
                    Bucket: process.env.BUCKET,
                    Key: uniqueFilename,
                    Expires: 60,
                    ContentType: request.query.file_type,
                    ACL: 'public-read-write'
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
    }, {
        method: 'GET',
        path: '/client/view-cv',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let cvid = request.query.cvid;

                const s3 = new aws.S3();
                const s3_params = {
                    Bucket: process.env.BUCKET,
                    Key: cvid,
                    Expires: 60,
                    ContentType: request.query.file_type,
                    ACL: 'public-read-write'
                };
                const file = require('fs').createWriteStream('./public/assets/Downloads/'+cvid);
                s3.getObject(s3_params).createWriteStream().pipe(file);
                // get file from AWS create a stream write to downloads 
                // If not pdf convert to pdf reply to frontend. 
                reply(file);



            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SignS3'
};
