'use strict';

const aws     = require('aws-sdk');
const uuid    = require('uuid');
const fs      = require('fs');

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.register = (server, options, next) => {
    const Domain = 'https://' + process.env.BUCKET + '.s3.amazonaws.com/';
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
                            url: Domain + uniqueFilename
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
                let cvUrl = request.query.cvUrl;
                const filePath = cvUrl.replace(Domain,'');
                const s3 = new aws.S3();
                const s3_params = {
                    Bucket: process.env.BUCKET,
                    Key: filePath
                    };
                console.log('CVURL', cvUrl);
               
                const file = fs.createWriteStream('./public/assets/Downloads/'+filePath);                

                s3.getObject(s3_params).createReadStream().pipe(file, reply(filePath));
            
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SignS3'
};
