'use strict'
var $ = window.$;


function sendContactForm() {

    $('.submit.button').on('click', function() {
        var firstName = $('input[name="firstName"]').val()
        var lastName = $('input[name="lastName"]').val()
        var email = $('input[name="email"]').val()
        var phoneNumber = $('input[name="phoneNumber"]').val()
        var text = $('textarea[name="text"]').val()
        var mailto = process.env.TEST_EMAIL

        var body = encodeURIComponent(' Hi Harness, \n\n ' + text + '\n\n' + 'Kind regards, \n\n ' + firstName + lastName + '\n\n' + email + ' ' + phoneNumber);
        window.location.href = 'mailto:' + mailto + '?subject=harness%20contact%20form&body=' + body

    });

}
sendContactForm()
