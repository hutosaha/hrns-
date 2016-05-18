'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/logout',
        config: {
            auth: false,
            handler: (request, reply) => {
                // let opts = { message: 'You\'ve logged out! Thanks for visiting the site. Come back soon!' };
                let layout = { layout: 'home' };
                
                request.cookieAuth.clear();
                request.state.user = '';

                reply.view('home', null, layout).state('bell_linkedin',null);
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Logout'
};
