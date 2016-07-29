'use strict';

const client = require('../client.js');
const getSetMembersInfo = require('./getsetmembersinfo.js');

module.exports = (set, candidateName, callback) => {


    let lowerCaseNoSpace = (name) => {
        return name.toLowerCase().replace(/ /g, '')
    }
    
    getSetMembersInfo(set, (candidates) => {
        
        if(candidates){
        	let existingCandidate = candidates.filter((candidate) => {
            	return lowerCaseNoSpace(candidateName) === lowerCaseNoSpace(candidate.candidateName)
        	})
        existingCandidate.length === 0 ? callback(false) : callback(existingCandidate);        
        } else {
        	callback(false);
        }
		
    })
};
