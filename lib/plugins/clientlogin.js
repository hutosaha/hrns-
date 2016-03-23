const checkUser  = require('../db/redis.js').checkUser;

exports.register = (server, options, next) => {

	server.route({

		 method: 'GET',
		 path: '/clientlogin',
		 config: {
		 	 auth: 'linkedin-oauth',
		 	 handler: (request,reply) => {

				 var id = request.auth.credentials.profile.id;

				 checkUser(id, (res) => {
					 if (res) {
						 reply('you\'re an existing user'); // go to dashboard
					 } else {
						 reply('you\'re a first-time user') // go to signup page
					 }
				 })

		 	 }
		 }
	});
	return next();
}

exports.register.attributes = {
	name:'ClientLogin'
}
