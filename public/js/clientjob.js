'use strict';

var $ = window.$;

$(document).ready(function() {

  var candidateName,
      cvid,
      vid,
      agencyEmail;

  $('.reject-button').click(function() {

    candidateName = $(this).data('candidate-name');
    cvid = $(this).data('cvid');
    vid = $(this).data('vid');
    agencyEmail = $(this).data('agency-email');

    if (candidateName) {
      $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
    }

    $('.ui.modal.reject-modal').modal('show');
    $('.ui.radio.checkbox').checkbox();

  });

  $('#modal-submit').click(function() {

    var reason = $('input[name="rejection-reason"]:checked').val();

    $('#modal-submit').toggleClass('loading');

    $.ajax({
        url: '/client/job/reject',
        data: {
          candidateName: candidateName,
          cvid: cvid,
          vid: vid,
          email: agencyEmail,
          reason: reason
        },
        async: true,
        success: function(res) {
          $('#modal-submit').remove();
          if (res) {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Candidate successfully rejected!!');
          } else {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Something went wrong, please try again...');
          }
        }
    });
  });

});
