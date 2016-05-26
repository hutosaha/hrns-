'use strict';

exports.register = (server, options, next) => {

    server.route([{
            method: 'GET',
            path: '/public/{params*}',
            config: {
                auth: false,
                handler: {
                    directory: {
                        path: 'public'
                    }
                }
            }
        }, {
            path: '/favicon-96x96.png',
            method: 'get',
            config: {
                cache: {
                    expiresIn: 1000 * 60 * 60 * 24 * 21

                }
            },
            handler: { file: './favicon.png' }


        }

    ]);
    return next();
};

exports.register.attributes = {
    name: 'Resources'
};
