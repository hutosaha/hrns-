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

    //$('.ui.modal.reject-modal').modal('show');
    $('.ui.radio.checkbox').checkbox();

    $('.coupled.modal.reject-modal')
      .modal({
        allowMultiple: false
      })
    ;
    // attach events to buttons
    $('.second.modal.reject-modal')
      .modal('attach events', '.first.modal .button')
    ;
    // show first now
    $('.first.modal.reject-modal')
      .modal('show')
    ;
  });

  $('.accept-button').click(function(){
    candidateName = $(this).data('candidate-name');
    cvid = $(this).data('cvid');
    vid = $(this).data('vid');
    agencyEmail = $(this).data('agency-email');
    $('.accept-candidateName').html(candidateName);
    
    $('.coupled.modal.accept-modal')
      .modal({
        allowMultiple: false
      })
    ;
    // attach events to buttons
    $('.second.modal.accept-modal')
      .modal('attach events', '.first.modal .button')
    ;
    // show first now
    $('.first.modal.accept-modal')
      .modal('show')
    ;

  });




  $('.modal-submit-rejection-button').click(function() {

    var reason = $('input[name="rejection-reason"]:checked').val();

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
          if (res) {
            var element = document.getElementById(cvid);
            element.remove();
          } else {
            alert('somehting went wrong');
          }
        }
    });

  });


  $('.modal-submit-acceptance-button').click(function() {

      $.ajax({
          url: '/client/job/accept',
          data: {
            candidateName: candidateName,
            cvid: cvid,
            vid: vid,
            email: agencyEmail
          },
          async: true,
          success: function(res) {
            if (res) {
              var element = document.getElementById(cvid);
              element.remove();
            } else {
                alert('somehting went wrong');                    
            }
          }
      });

  });

  if ($('.listView').length === 0 ) { 
    $('.header.message').html('There are no candidates yet!');
  }


});
