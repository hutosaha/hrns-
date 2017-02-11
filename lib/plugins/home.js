'use strict';

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/',
        config: {
            auth: false,
            handler: (request, reply) => {
              const layout = { layout: 'home' };
              const cookie = request.state.user;

              if (cookie) {
                const scope  = cookie.scope;

                if (scope === 'candidate') {
                  reply.redirect('/candidate');
                } else if (scope === 'admin') {
                  reply.redirect('/admindashboard');
                } else if (scope === 'client') {
                  reply.redirect('/client');
                } else if (scope === 'agency') {
                  reply.redirect('/agency');
                } else {
                  reply.view('home', null, layout);
                }
              } else {
                reply.view('home', null, layout);
              }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Home'
};
