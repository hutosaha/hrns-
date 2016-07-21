const Joi = require('joi');

const app = module.exports = {};

const backendInput = new RegExp(/^[-a-zA-Z0-9 .,£$€?@!+\'()\#\&\^\%\"\{\}\=\~\:\;]*/);

app.url = 'https?://.+';
app.frontendInput = '[-a-zA-Z0-9 .,£$€?@!+\'()\#\&\^\%\"\{\}\=\~\:\;]*'
    //app.frontendInputSalary = '[([£ ,.])\d+]*'; // check on regex101 if you change only pounds for MVP.
app.phoneNumber = '[0-9]{1,20}';

app.clientSignUpSchema = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    companySector: Joi.string(),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    companyDescription: Joi.any().optional(),
    companySize: Joi.string(),
    website: Joi.any().optional(),
    twitter: Joi.any().optional(),
    facebook: Joi.any().optional(),
    linkedin: Joi.any().optional(),
    logo_url: Joi.any().optional(),
    companyLogo: Joi.any().optional()
};

app.agencySignUpSchema = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    companySize: Joi.string(),
    agencySpecialism: Joi.string()
};

app.submitJobSchema = {
    jobTitle: Joi.string().min(1).max(100).required().regex(backendInput),
    jobDescription: Joi.string().min(1).max(3000).required().regex(backendInput),
    jobCategory: Joi.any().optional(),
    teamCulture: Joi.string().min(1).max(100).required().regex(backendInput),
    typesOfProjects: Joi.string().min(1).max(100).required().regex(backendInput),
    teamSize: Joi.any().optional(),
    skillOne: Joi.any().optional(),
    skillTwo: Joi.any().optional(),
    skillThree: Joi.any().optional(),
    personality: Joi.any().optional(),
    salary: Joi.string().required(),
    package: Joi.string().required(),
    searchProgress: Joi.any().optional(),
    searchDeadline: Joi.any().optional()
};

app.submitCandidateSchema = {
    candidateName: Joi.string().min(1).max(100).required().regex(backendInput),
    jobTitle: Joi.string().min(1).max(100).required().regex(backendInput),
    company: Joi.string().min(1).max(100).required(),
    jobCategory: Joi.string().min(1).max(100).required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(),
    salary: Joi.string().min(1).max(100).required(),
    contractType:Joi.any().required(),
    location: Joi.string().min(1).max(100).required(),
    linkedInProfile: Joi.any().optional(),
    file_name: Joi.any(),
    file_url: Joi.any()
};

app.interviewSchema = {
    firstIntDate: Joi.any().required(),
    firstIntTime : Joi.any().required(),
    secondIntDate :Joi.any().optional(),
    secondIntTime: Joi.any().optional(),
    thirdIntDate: Joi.any().optional(),
    thirdIntTime: Joi.any().optional(),
    additionalComments: Joi.any().optional(),
    interviewAddress: Joi.any().optional(),
    agencyEmail: Joi.any().optional(),
    agencyId:Joi.any().optional(),
    stage: Joi.any().optional(),
    candidateName: Joi.any().optional(),
    jobTitle: Joi.any().optional(),
    companyName: Joi.any().optional(),
    cvid: Joi.any().optional(),
    vid: Joi.any().optional(),
    jobDescription_url: Joi.any().optional()
};
