
exports.register = (server,options,next)=>{

	server.route({

		 method:'GET',
		 path:'/',
		 config: {
		 	auth : false, 
		     handler: (request,reply) => {
		 		reply.view('index.html');
		 	 }
		 }


	});
	return next();

};

exports.register.attributes = {
	name:'Home'
}