const Vision		 = require('vision');
const Blipp 		 = require('blipp');
const Inert 		 = require('inert');

const Candidate 		 = require('./plugins/candidate.js');
const Client				 = require('./plugins/client.js');
const Login 				 = require('./plugins/login.js');
const ClientSignUp   = require('./plugins/clientsignup.js');
const Home 					 = require('./plugins/home.js');
const AdminDashboard = require('./plugins/admindashboard.js');
const Logout			   = require('./plugins/logout.js');
const AdminVacancies = require('./plugins/adminvacancies.js');
const ApproveUsers   = require('./plugins/approveusers.js');
const UserInfo       = require('./plugins/userinfo.js');
const AgencyLogin    = require('./plugins/agencylogin.js');
const Agency         = require('./plugins/agency.js');
const AgencySignUp   = require('./plugins/agencysignup.js');
const Resources      = require('./plugins/resources.js');

module.exports = [Blipp, Inert, Vision, Home, Login, Candidate, Client, ClientSignUp, AdminDashboard, Logout, AdminVacancies, ApproveUsers, UserInfo, AgencyLogin, Agency, AgencySignUp, Resources];
