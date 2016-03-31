'use strict';
module.exports = (array) => {
	let out = '<div class="users">';
	console.log('Array',array);
	if(!array) return '<h1> Nobody waiting for approval </h1>' ;
	array.forEach((elem) => {
		out += '<ul id="' + elem['id'] + '">';
		for(var key in elem) {
			console.log('keys', key);
			out += '<li> <a href= "approveusers/'+elem[key]+'">' + elem[key] +' </a></li>';
			
		}
		out += '<button href="approveuser/'+elem['id'] +'>Approve </button> </ul></div>';
	
		
	});
	return out;
};