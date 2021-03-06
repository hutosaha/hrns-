'use strict';

const Handlebars = require('handlebars');

module.exports = (stage) => {
    let result = {
        stageFour: 'checked',
        defaultStage: ''
    };

    return new Handlebars.SafeString(result[stage] ? result[stage] : result["defaultStage"]);
};
