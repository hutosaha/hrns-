

exports.register = (server, options,next) =>  {

	server.route({ 
		 method:'GET',
		 path:'/clientlogin',
		 config: {
		 	auth:'linkedin-oauth',
		 	handler: (request,reply) =>{
		 		reply.view('index.html');
		 	}
		 }
	});

	return next();

}

exports.register.attributes = {
	name:'ClientLogin'
}