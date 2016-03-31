exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/',
        config: {
            auth: false,
            handler: (request, reply) => {
                if (request.state.user) {
                  const scope = request.state.user.scope;
                  const type = request.state.user.type;
                  if (scope === 'candidate') {
                    reply.redirect('/candidate');
                  } else if (scope === 'client') {
                    reply.redirect('/client');
                  } else if (type === 'client') {
                    reply.redirect('/login/client');
                  } else if (scope === 'admin') {
                    reply.redirect('/admindashboard');
                  } else if (scope === 'agency') {
                    reply.redirect('/agency');
                  }
                } else {
                  reply.view('home', null, {
                    layout: 'home'
                  });
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'Home'
};
