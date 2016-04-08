'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: false,
            handler: (request, reply) => {
                request.cookieAuth.clear();
                reply.view('message', {
                    message: 'You\'ve logged out! Thanks for visiting the site. Comeback soon!'
                }, {
                    layout: 'logout'
                });
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Logout'
};
