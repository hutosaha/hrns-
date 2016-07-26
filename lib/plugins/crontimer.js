
//var CronJob = require('cron').CronJob;

const getSetMembersInfo = require('../db/redis.js').getSetMembersInfo;
const moment                    = require('moment');
// const emailAdminHarnessTalentCv = require('./utils/mailgun.js').emailAdminHarnessTalentCv;
// const mailgun = require('./utils/mailgun.js');



exports.register = (server, options, next) => {

        server.route({
                method: 'GET',
                path: '/crontimer',
                config: {
                    auth: false,
                    handler: (request, reply ) => {
                        // let opts = { message: 'You\'ve logged out! Thanks for visiting the site. Come back soon!' };
                        getSetMembersInfo('HarnessTalent', (array) => {
                                // const keys = array.map(Object.keys(array))


                                      array.forEach( function (arrayItem)
                                      {
                                          const date1 = arrayItem.dateSubmitted;
                                          const formattedDate = date1

                                          console.log();
                                      });

                                request.view = reply.view;
                                reply.view = reply.view;
                            }
                        );
                    }
                }
           });
            return next();
        };




exports.register.attributes = {
            name: 'Cron'
  };


        // new CronJob('00 56 11 * * 1-5', function() {
        //
        // emailAdminHarnessTalentCv.to = 'tormodsmith@gmail.com';
        // mailgun.messages().send(emailAdminHarnessTalentCv);
        //
        // console.log('yo sssssup');
        // }, null, true, 'Europe/London');



        // if(initial > 5weeks){
        //
        // }
        // if(initial < 0){
        //     opts.message = 'There are no approved agencies';
        // }
        // opts.agencies = agencies;
        // opts.clients =clients;


        // add a warning date and expiry date to the data base on candidate submission.



        //On warning date function runs to send and email to agency informing them to re upload the cv within a week
        // must include name of candidate.

        // on expiry date function is run to delete candidate from the database.
        // IF candidate exists function is run to keep candidate and reset the expiration date for 7weeks.
        // these functions will be in the harness-talent-submitcandidate route




        // this function HERE will map through the entire list checking the warning date and expiration date
        //
        // //
        // new CronJob('01 * * * * 1-5', function() {
        //
        //             var reformattedArray = talentList.map(function(obj) {
        //                     var newObj = {};
        //                     newObj[obj.warning] = obj.value
        //                     if (obj.initial < 5 weeks) {
        //
        //                         emailAdminHarnessTalentCv.to = 'tormodsmith@gmail.com';
        //                         mailgun.messages().send(emailAdminHarnessTalentCv);
        //                     }
        //                     if
        //                     else(obj.initial > 6 weeks) {
        //                         client.Del
        //                     }
        //
        //
        //                 }
        //                 return newObj;
        //             });
        //     }
        //triggers email function at warning date
        // triggers delete function at expiration
