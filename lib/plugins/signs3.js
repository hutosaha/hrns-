'use strict';

const aws     = require('aws-sdk');
const uuid    = require('uuid');
const fs      = require('fs');
const checkFileMimeType = require('./utils/app.js').checkFileMimeType;

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
              const fileFormat = request.query.file_type;

                var getSignedRequest = () => {
                  const s3 = new aws.S3();
                  const uniqueFilename = uuid.v1()  + request.query.file_name;
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
                };

                checkFileMimeType(fileFormat, (response) => {

                    response === "invalidFileFormat" ? reply(response) : getSignedRequest();
                });
            }
        }
    }, {
        method: 'GET',
        path: '/client/download-file',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                const cvUrl = request.query.cvUrl;
                const ext = request.query.ext;
                const mswordFiles = [ "doc", "docx" ];
                const filePath = cvUrl.replace(Domain,'');

                var writeFile = (callback) => {
                  const s3 = new aws.S3();
                  const s3_params = {
                    Bucket: process.env.BUCKET,
                    Key: filePath
                };

                  const file = fs.createWriteStream('./public/assets/Downloads/'+ filePath);
                  s3.getObject(s3_params)
                    .on('httpData', function(chunk) { file.write(chunk); })
                    .on('httpDone', function() { file.end(); })
                    .on('success', function(response) {
                      callback("fileDownloaded") })
                    .send();
                };

                writeFile((response) => {
                  reply(filePath);
                });
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SignS3'
};
