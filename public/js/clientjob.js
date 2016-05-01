'use strict';

var $ = window.$;

$(document).ready(function() {

  var candidateName,
      cvid,
      vid,
      agencyEmail,
      agencyId,
      jobTitle;

  $('.reject-button').click(function() {

    candidateName = $(this).data('candidate-name');
    cvid = $(this).data('cvid');
    vid = $(this).data('vid');
    agencyEmail = $(this).data('agency-email');
  
    if (candidateName) {
      $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
    }

    $('.ui.radio.checkbox').checkbox();

    $('.coupled.modal.reject-modal')
      .modal({
        allowMultiple: false
      });

  
    $('.first.modal.reject-modal')
        .modal('show')
      ;
    });

    $('.modal-cancel').modal('hide','.first.modal');


  $('.modal-confirmation-rejection-button').click(function() {

    $('.second.modal.reject-modal').modal('show', '.first.modal .button');

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
            if ($('.listView').length === 0 ) { 
                $('.message').html('There are no candidates yet!');
            }
          } else {
            alert('somehting went wrong');
          }
        }
    });

  });

  $('.accept-button').click(function(){
    candidateName = $(this).data('candidate-name');
    cvid = $(this).data('cvid');
    vid = $(this).data('vid');
    agencyEmail = $(this).data('agency-email');
    agencyId = $(this).data('agency-id');
    jobTitle = $(this).data('job-title');
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




  $('.modal-submit-acceptance-button').click(function() {

      $.ajax({
          url: '/client/job/accept',
          data: {
            candidateName: candidateName,
            cvid: cvid,
            vid: vid,
            email: agencyEmail,
            agencyId: agencyId,
            jobTitle: jobTitle
          },
          async: true,
          success: function(res) {
            if (res) {
              var element = document.getElementById(cvid);
              element.remove();
                if ($('.listView').length === 0 ) { 
                    $('.message').html('There are no new candidates for this position.');
                }
            } else {
                alert('somehting went wrong');                    
            }
          }
      });

  });


  if ($('.listView').length === 0 ) { 
    $('.message').html('There are no candidates yet!');
  }


});
