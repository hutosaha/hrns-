'use strict';

var $ = window.$;

$(document).ready(function() {

      $('.reject-button').click(function() {

        var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var agencyEmail = $(this).data('agency-email');

        if (candidateName) {
            $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
        }

        $('.ui.checkbox').checkbox();

        $('.coupled.modal.reject-modal')
            .modal({
                allowMultiple: false
            });

        $('.first.modal.reject-modal')
            .modal('show');


        var $inputs = $('input[name=rejection-reason]');
        $('input[name=rejection-reason]').change(function() {
            if (this.checked)
                $inputs.not(this).prop('checked', !this.checked);
        });



        $('.confirm-rejection-button').click(function() {
                  $('.first.modal.reject').modal('hide');
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
                        if ($('.listView').length === 0) {
                            $('.message').html('There are no candidates yet!');
                        }
                    }
                }
            });

        });
    });

    $('.accept-button').click(function() {
        var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var agencyEmail = $(this).data('agency-email');
        var agencyId = $(this).data('agency-id');
        var jobTitle = $(this).data('job-title');
        $('.accept-candidateName').html(candidateName);

        $('.coupled.modal.accept-modal')
            .modal({
                allowMultiple: false
            });
        // attach events to buttons
        $('.second.modal.accept-modal')
            .modal('attach events', '.first.modal .button');
        // show first now
        $('.first.modal.accept-modal')
            .modal('show');



        $('.modal-cancel-acceptance').click(function() {
            $('.first.modal.accept-modal').hide();
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
                        if ($('.listView').length === 0) {
                            $('.message').html('There are no new candidates for this position.');
                        }
                    } 
                }
            });

        });

    });
    if ($('.listView').length === 0) {
        $('.message').html('There are no candidates yet!');
    }


});
