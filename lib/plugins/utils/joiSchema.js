const Joi = require('joi');

const app = module.exports = {};

const backendInput = new RegExp(/^[a-zA-Z0-9 .,£$€?\-@!:;]*$/);
const url = 'https?://.+';

app.url = url;
app.backendInput = backendInput;
app.frontendInput = '[a-zA-Z0-9 .,£$€?\-@!:;]*';

app.clientSignUpSchema = {
    contactName: Joi.string().min(1).max(30).required().regex(backendInput),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().alphanum().required(),
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
  jobTitle: Joi.string().min(1).max(30).required().regex(backendInput),
  jobDescription: Joi.string().min(1).max(3000).required().regex(backendInput),
  teamCulture: Joi.string().min(1).max(100).required().regex(backendInput),
  typesOfProjects: Joi.string().min(1).max(100).required().regex(backendInput),
  skillOne: Joi.any().optional(),
  skillTwo: Joi.any().optional(),
  skillThree: Joi.any().optional(),
  personality: Joi.any().optional(),
  salary: Joi.any().optional(),
  searchDeadline: Joi.date()
};
