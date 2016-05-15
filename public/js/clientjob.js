'use strict';

var $ = window.$;

$(document).ready(function() {

    $('.cv-viewer').click(function() {
        /// need to write file before iframe injection 

       var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var agencyEmail = $(this).data('agency-email');
        var agencyId = $(this).data('agency-id');
        var jobTitle = $(this).data('job-title');

        const ext = cvid.substr(cvid.lastIndexOf('.')+1);
        
        if ( ext === 'pdf') {
                $('iframe').attr('src', '');
                $.ajax({
                    url: '/client/view-cv',
                    data: {
                        cvid: cvid
                    },
                    async: true,
                    success: function(pathName) {
                            if (pathName) {

                                var src = "/public/assets/ViewerJS/#../Downloads/" +pathName;
                                $('iframe').attr('src', src);
                                setTimeout(function(){
                                   document.getElementById('iframe').contentWindow.location.reload();
                                },2000);

                            }
                    }
                });


               
                // make an ajax call to convert and write file . 
                $('.ui.basic.doc-viewer.modal').modal('show');


                $('.reject').click(function() {

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
                                    $('.ui.basic.doc-viewer.modal').modal('hide');

                                    if ($('.listView').length === 0) {
                                        $('.message').html('There are no candidates yet!');
                                    }
                                }
                            }
                        });
                    });
                });
            } else {
                $(this).html('Only pdf files');
                $(this).attr('disabled','disabled');            
        }
    


        $('.accept').click(function() {
            $('.ui.basic.doc-viewer.modal').modal('hide');

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
                        $('.doc-viewer.modal').hide();
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
            $('.second.coupled.modal.accept-modal').modal('hide');


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
