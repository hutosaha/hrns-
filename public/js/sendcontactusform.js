'use strict'
var  $ = window.$;


 function sendContactForm(){

  $('.submit.button').on('click', function(){
  var firstName = $('input[name="firstName"]').val()
  var lastName = $('input[name="lastName"]').val()
  var email = $('input[name="email"]').val()
  var phoneNumber = $('input[name="phoneNumber"]').val()
  var text = $('textarea[name="text"]').val()
  var mailto = 'tormodsmith@gmail.com'

  var body = encodeURIComponent(' Hi Harness, \n\n ' + text + '\n\n' + 'Kind regards, \n\n ' + firstName + lastName + '\n\n' + email + ' ' + phoneNumber );
  window.open('mailto:' + mailto + '?subject=harness%20contact%20form&body=' + body );
  window.close
});

}
sendContactForm()
