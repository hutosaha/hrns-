'use strict';

const aws     = require('aws-sdk');
const uuid    = require('uuid');
const unoconv = require('unoconv');
const fs      = require('fs');
const checkFileMimeType = require('./utils/app.js').checkFileMimeType

aws.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.register = (server, options, next) => {

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

                checkFileMimeType(fileFormat, (response) => {
                  response === "validFileFormat" ? getSignedRequest() : reply("invalidFileFormat");
                })
            }
        }
    }, {
        method: 'GET',
        path: '/client/get-file-from-s3',
        config: {
            auth: {
                strategy: 'hrns-cookie',
                scope: 'client'
            },
            handler: (request, reply) => {
                let fileName = request.query.fileName;
                let fileExtension = fileName.substr(fileName.lastIndexOf('.')+1);
                let cvid = request.query.cvid;
                console.log(cvid.slice(0, cvid.length - 4), '-', fileName);

                var writeFile = (callback) => {
                  const s3 = new aws.S3();
                  const s3_params = {
                    Bucket: process.env.BUCKET,
                    Key: fileName
                  };

                  const file = fs.createWriteStream('./public/assets/Downloads/'+ cvid + fileExtension);
                  s3.getObject(s3_params)
                    .on('httpData', function(chunk) { file.write(chunk); })
                    .on('httpDone', function() { file.end(); })
                    .on('success', function(response) {
                      callback("file fully downloaded") })
                    .send();
                }

                writeFile((callback) => {
                  console.log('DONE?');
                })
            }
        }
    }]);
    return next();
};

exports.register.attributes = {
    name: 'SignS3'
};
