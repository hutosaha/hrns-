const checkUser  = require('../db/redis.js').checkUser;

exports.register = (server, options, next) => {

	server.route({

		 method: 'GET',
		 path: '/login/{params*}',
		 config: {
		 	 auth: 'linkedin-oauth',
		 	 handler: (request,reply) => {
		 	 	// if param is candidate, redirect to candidateUpload
		 	 	if(!request.params ===' candidate' )
		 	 	// check if client exists in DB

		 	 	// if they're approved redirect to their dashboard 

		 	 	// if they're unapproved, display a page asking them to keep an eye on their emails

		 	 	// if they don't exist in the DB, redirect to signup

		 	 }
		 }
	});
	return next();
}

exports.register.attributes = {
	name:'ClientLogin'
}


// console.log(request.params);
// 		 	 	const userType = request.params ; 
// 		 	 	var id = request.auth.credentials.profile.id;
//     			//  check user exisits 
// 				 checkUser(id, (res) => {
// 					 if (res) {
// 						 reply('you\'re an existing user'); // go to dashboard
// 					 } else {
// 						 reply('you\'re a first-time user') // go to signup page
// 					 }
// 				 })