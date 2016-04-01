'use strict';

const admins  = ['VkekfrcDpl', 'UNBC8cqKaL'];
const isAdmin = require('./utils/app.js').isAdmin;

exports.register = (server, options, next) => {

    server.route({

        method: 'GET',
        path: '/admindashboard',
        config: {
            auth: 'hrns-cookie',
            handler: (request,reply) => {

                let id = request.auth.credentials.profile.id;
                let admin = isAdmin(id, admins);

                if(admin) {
                  request.cookieAuth.set('scope', 'admin');
                  reply.view('admindashboard');
                } else {
                  reply('Sorry - it doesn\' look like you\'re an admin! Return <a href="/">home</a>');
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminDashboard'
};
