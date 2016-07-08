const Vision		 = require('vision');
const Blipp 		 = require('blipp');
const Inert 		 = require('inert');

const Adminharnesstalent = require('./plugins/admin/adminharnesstalent.js');
const Interviews      = require('./plugins/interview.js');
const AdminDashboard  = require('./plugins/admin/admindashboard.js');
const AdminVacancies  = require('./plugins/admin/adminvacancies.js');
const ApproveUsers    = require('./plugins/admin/approveusers.js');
const ApproveUser     = require('./plugins/admin/approveuser.js');
const UserInfo        = require('./plugins/admin/userinfo.js');
const AdminJob        = require('./plugins/admin/adminjob.js');
const SubmitVacancyCV = require('./plugins/agency/submitvacancycv.js');
const SubmitCandidate = require('./plugins/agency/submitcandidate.js');
const AgencySignUp    = require('./plugins/agency/agencysignup.js');
const AgencyMyJobs    = require('./plugins/agency/agencymyjobs.js');
const AgencyLogin     = require('./plugins/agency/agencylogin.js');
const AgencyJob       = require('./plugins/agency/agencyjob.js');
const Agency          = require('./plugins/agency/agency.js');
const Candidate 	  = require('./plugins/candidate/candidate.js');
const ClientSignUp    = require('./plugins/client/clientsignup.js');
const Scheduling      = require('./plugins/client/scheduling.js');
const SubmitJob       = require('./plugins/client/submitjob.js');
const ClientJob       = require('./plugins/client/clientjob.js');
const Client		  = require('./plugins/client/client.js');
const Resources       = require('./plugins/resources.js');
const SignS3		  = require('./plugins/signs3.js');
const Logout		  = require('./plugins/logout.js');
const Login 		  = require('./plugins/login.js');
const Home 			  = require('./plugins/home.js');


module.exports = [Blipp, Inert, Vision, Home, Login, Candidate, Client, ClientSignUp, AdminDashboard, Logout, AdminVacancies, ApproveUsers, ApproveUser, UserInfo, AgencyLogin, Agency, AgencySignUp, Resources, SubmitJob, ClientJob, AgencyJob, AdminJob, SignS3, SubmitVacancyCV, AgencyMyJobs, SubmitCandidate, Scheduling, Interviews, Adminharnesstalent];
