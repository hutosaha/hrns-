'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: false,
            handler: (request, reply) => {
                let opts = { message: 'You\'ve logged out! Thanks for visiting the site. Come back soon!' };
                let layout = { layout: 'logout' };
                
                request.cookieAuth.clear();
                request.state.user = '';

                reply.view('message', opts, layout).state('bell_linkedin',null);
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Logout'
};
