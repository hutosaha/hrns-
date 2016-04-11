'use strict';

const client = require('../client.js');


module.exports = (vid, id, callback) => {

	client.sremAsync('livejobs', vid)
	.then(() => {
		client.sremAsync(id+'jobs', vid)
		.then(() => {
		client.del(vid);
		})
		.then(() =>{
		callback(true);			
		});
	})
	.catch((err) =>  {
		console.log('err',err);
		callback(false);
	});
};
