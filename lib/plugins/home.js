exports.register = (server, options, next) => {

	server.route({

		 method: 'GET',
		 path: '/',
		 config: {
		 	auth : false,
		     handler: (request,reply) => {
		 		// validate user session 
		 		const userSession = request.state.user;
			  if(userSession) {

				  	 if (user.type === 'candidate') {
				  	 	reply('you are a candidate');
				  	 } else if (user.type === 'client') {
				  	 	reply('you\'re a client');
				  	 } else {
				  	 	reply('agencey');
				  	 }
			   } 
		 		reply.view('home');
		 	 }
		 }
	});
	return next();
};

exports.register.attributes = {
	name:'Home'
}
