'use strict';

var $ = window.$;


$('.reject').click(function() {

  var candidateName = $(this).data('candidate-name');
  var cvid = $(this).data('cvid');
  var vid = $(this).data('vid');
  var email = $(this).data('agency-email');

  if (candidateName) {
    $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
  }

  $('.ui.modal.reject').modal('show');
  $('.ui.radio.checkbox').checkbox();

  $('#modal-submit').click(function() {

    var reason = $('input[name="rejection-reason"]:checked').val();

    $('#modal-submit').toggleClass('loading');

    $.ajax({
        url: '/client/job/reject',
        data: {
          candidateName: candidateName,
          cvid: cvid,
          vid: vid,
          email: email,
          reason: reason
        },
        async: true,
        success: function(res) {
          $('#modal-submit').remove();
          if (res) {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Candidate successfully rejected!!');
            // setTimeout(() => location = '/client/job/' + vid, 3000);
          } else {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Something went wrong, please try again...');
            // setTimeout(() => location = '/client/job/' + vid, 3000);
          }
        }
    });
  });
});
