'use strict';

exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/admindashboard',
        config: {
            auth: 'hrns-cookie',
            handler: (request,reply) => {
                    let id = request.auth.credentials.profile.id;

                    if(id === 'VkekfrcDpl') {
                        request.cookieAuth.set('scope', 'admin')
                        reply.view('admindashboard');
                    } else {
                        reply('not admin');
                    }
                }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminDashboard'
};




         
                          

