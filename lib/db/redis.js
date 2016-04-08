'use strict';

const app = module.exports = {};

app.addClientSignUpDetails = require('./redis/addclientsignupdetails.js');
app.addAgencySignUpDetails = require('./redis/addagencysignupdetails.js');
app.addCVagainstVacancy    = require('./redis/addcvagainstvacancy.js');
app.addRemoveFromSets      = require('./redis/addremovefromsets.js');
app.getSetMembersInfo      = require('./redis/getsetmembersinfo.js');
app.getVacancyDetails      = require('./redis/getvacancydetails.js');
app.isExistingUser         = require('./redis/isexistinguser.js');
app.isAMemberOfSet         = require('./redis/isamemberofset.js');
app.checkUserType          = require('./redis/checkusertype.js');
app.getSetMembers          = require('./redis/getsetmembers.js');
app.addIdToSet             = require('./redis/addidtoset.js');
app.addJob                 = require('./redis/addjob.js');
