exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/',
        config: {
            auth: false,
            handler: (request, reply) => {
                const userSession = request.state.user;
                if (userSession) {
    				console.log(userSession);
                    if (userSession.scope === 'candidate') {
                        reply.redirect('/candidate');
                    } else if (userSession.scope === 'client') {
                        reply.redirect('/client');
                    } else if (userSession.type === 'client') {
                        reply.redirect('/login/client');
                    } else if (userSession.scope === 'admin') {
                        reply.redirect('/admindashboard');
                    } else { // TODO - if agencies have scope
                        reply('you\'re  agency');
                    }
                } else {
                    reply.view('home');
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Home'
};
