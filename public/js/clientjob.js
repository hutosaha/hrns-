'use strict';

var $ = window.$;


$('.reject').click(function() {

  var name = $(this).data('candidate-name');
  var cvid = $(this).data('cvid');
  var vid = $(this).data('vid');
  var email = $(this).data('agency-email');

  if (name) {
    $('#modal-heading').html('Sorry to hear you want to reject ' + name);
  }

  $('.ui.modal.reject').modal('show');
  $('.ui.radio.checkbox').checkbox();

  $('#modal-submit').click(function() {

    var reason = $('input[name="rejection-reason"]:checked').val();

    $('#modal-submit').toggleClass('loading');

    $.ajax({
        url: vid + '/reject/' + email + '/' + cvid + '/' + reason,
        success: function(res) {
          console.log('res', res);
          $('#modal-submit').remove();
          if (res) {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Candidate successfully rejected!!');
            setTimeout(() => location = '/client/job/' + vid, 3000);
          } else {
            $('#modal-message').toggleClass('hidden');
            $('#modal-message').html('Something went wrong, please try again...');
            setTimeout(() => location = '/client/job/' + vid, 3000);
          }
        }
    });
  });
});
