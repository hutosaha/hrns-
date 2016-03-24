exports.register = (server, options, next) => {

	server.route({

		 method: 'GET',
		 path: '/',
		 config: {
		 	auth : false,
		     handler: (request,reply) => {
		 		// validate user session
		 		const userSession = request.state.user;
			  if (userSession) {

				  	 if (userSession.scope === 'candidate') {
				  	 	reply.redirect('/candidate');
						} else if (userSession.scope === 'client') {
				  	 	reply.redirect('/client');
						} else { // TODO - if agencies have scope
				  	 	reply('you\'re an agency');
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
	name:'Home'
}
