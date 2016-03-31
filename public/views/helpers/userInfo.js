'use strict';
module.exports = (array) => {
	let out = '<div class="users">';

	array.forEach((elem) => {
		console.log('foreach out', out);
		out += '<ul id="' + elem['id'] + '">';
		for(var key in elem) {
			console.log('for in out', out);
			out += '<li>' + elem[key] + '</li>';
		}
		out += '</ul>' +
		'<input type="checkbox" id="' + elem['id'] + '"> <label for="'+ elem['id'] + '">Approve this user</label>' +
		'<br><br>';
	});
	console.log('final out', out);
	return out += '<button action="/approveusers" method="POST"> Save changes </button>' +
	'</div>';
};