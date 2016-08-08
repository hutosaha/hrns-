'use strict';

var $ = window.$;

$(document).ready(function() {

    DOCUMENTVIEWER.init();
    // Currently need these as well inorder to be active before the cv viewer is clicked.

    $('.reject-button').click(function() { // reject button 
      
        var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var agencyEmail = $(this).data('agency-email');
        //var agencyId = $(this).data('agency-id');
        //var jobTitle = $(this).data('job-title');

        if (candidateName) { $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName); }

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
            $('.second.coupled.modal.accept-modal').modal('hide');

            var reason = $('input[name=rejection-other-reason]').val(); /// add other reason for rejection.

            if (reason === "") {
                reason = $('input[name="rejection-reason"]:checked').val();
            }

            $.ajax({
                url: '/client/scheduling/reject',
                data: {
                    candidateName: candidateName,
                    cvid: cvid,
                    vid: vid,
                    email: agencyEmail,
                    reason: reason,
                    list: 'clientShortlist'
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



    $('.accept-button').click(function() { // page accept button 

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

        $('.modal-submit-acceptance-button').click(function() {
            $('.first.modal.accept-modal').hide();
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


});
