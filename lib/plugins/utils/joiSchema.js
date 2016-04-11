const Joi = require('joi');

const app = module.exports = {};

const backendInput = new RegExp(/^[-a-zA-Z0-9 .,£$€?@!:;]*$/);

app.url = 'https?://.+';
app.frontendInput = '[-a-zA-Z0-9 .,£$€?@!:;]*';
app.phoneNumber = '[0-9]{1,20}';

app.clientSignUpSchema = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(),
    companySector: Joi.string(),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    companyDescription: Joi.any().optional(),
    companySize: Joi.string(),
    website: Joi.any().optional(),
    twitter: Joi.any().optional(),
    facebook: Joi.any().optional(),
    linkedin: Joi.any().optional()
};

app.agencySignUpSchema = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    companyName: Joi.string().min(1).max(50).required().regex(backendInput),
    contactNumber: Joi.string().alphanum().required(),
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
    salary: Joi.any().optional(),
    searchProgress: Joi.any().optional(),
    searchDeadline: Joi.any().optional()
};

app.submitCandidateSchema = {
    candidateName: Joi.string().min(1).max(100).required().regex(backendInput),
    jobTitle: Joi.string().min(1).max(100).required().regex(backendInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(), 
    salary: Joi.string().min(1).max(100).required(),
    linkedInProfile: Joi.any().optional(),
    file_name: Joi.any(),
    file_url: Joi.any()
};
