'use strict';


const admins = process.env.ADMIN_MEMBERS;

const isAdmin = require('../utils/app.js').isAdmin;

exports.register = (server, options, next) => {

    server.route({
        method: 'GET',
        path: '/admindashboard',
        config: {
            auth: 'hrns-cookie',
            handler: (request, reply) => {
                let opts   = { title: 'Admin Dashboard' };
                let layout = { layout: 'admin' };
                let id     = request.auth.credentials.profile.id;
                console.log('request.auth.c' , request.auth.credentials.profile.id);
                let admin  = isAdmin(id, admins);
                console.log('admin', admin);

                if (admin) {
                    request.cookieAuth.set('scope', 'admin');
                    reply.view('admindashboard', opts, layout);
                } else {
                    reply.view('message', { message: 'Sorry - it doesn\' look like you\'re an admin! Return <a href="/">home</a>'});
                }
            }
        }
    });
    return next();
};

exports.register.attributes = {
    name: 'AdminDashboard'
};
