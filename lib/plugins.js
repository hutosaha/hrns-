const Vision		 = require('vision');
const Blipp 		 = require('blipp');
const Inert 		 = require('inert');

const Candidate 		= require('./plugins/candidate.js');
const Login 				= require('./plugins/login.js');
const Client				= require('./plugins/client.js');
const ClientSignUp  = require('./plugins/clientSignup.js');
const Home 					= require('./plugins/home.js');
const AdminDashboard= require('./plugins/admindashboard.js');
const Logout			  = require('./plugins/logout.js');

module.exports = [Blipp, Inert, Vision, Home, Login, Candidate, Client, ClientSignUp, AdminDashboard, Logout];
