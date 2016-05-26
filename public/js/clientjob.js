'use strict';

var $ = window.$;

window.onbeforeunload = () => {
    $.ajax({
        url: '/client/clear-downloads',
        async: true,
        success: function(response) {
            console.log(response);
        }
    });
};

$(document).ready(function() {

    if ($('.listView').length === 0) { $('.message').html('There are no candidates yet!'); }

    $('.cv-viewer').on('click',function(e) {
        e.preventDefault();
        const relatedInfoObject = {
            candidateName: $(this).data('candidate-name'),
            cvid: $(this).data('cvid'),
            vid: $(this).data('vid'),
            agencyEmail: $(this).data('agency-email'),
            agencyId: $(this).data('agency-id'),
            jobTitle: $(this).data('job-title')
        };
        const cvUrl = $(this).data('url');
        //const msDocumentTypes = ['doc', 'docx'];

        const ext = cvUrl.substr(cvUrl.lastIndexOf('.') + 1);

        isFileAlreadyDownloaded(cvUrl, (fileName) => {
             
            if (fileName !== 'notFound') {
                var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;                       
                var word ="https://view.officeapps.live.com/op/embed.aspx?src=https://hrns.herokuapp.com/public/assets/downloads/"+fileName;
                ext === 'pdf' ? viewFile(fileName,relatedInfoObject, pdf) : viewFile(fileName, relatedInfoObject, word);
            } else {
                downloadFile(cvUrl, ext, (fileName) => {
                console.log('EXT', ext, fileName);
                var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;                       
                var word ="https://view.officeapps.live.com/op/embed.aspx?src=https://hrns.herokuapp.com/public/assets/downloads/"+fileName;
                ext === 'pdf' ? viewFile(fileName, relatedInfoObject, pdf) : viewFile(fileName, relatedInfoObject, word);
                    
                });
            }
        });
    });


    var isFileAlreadyDownloaded = (cvUrl, callback) => { // why would it be downloaded ? 

        $.ajax({
            url: '/client/file-exists',
            data: {
                cvUrl: cvUrl
            },
            async: true,
            success: function(response) {
                callback(response);
            }
        });
    };

    var downloadFile = (cvUrl, ext, callback) => {
        $.ajax({
            url: '/client/download-file',
            data: {
                cvUrl: cvUrl,
                ext: ext
            },
            async: true,
            success: function(response) {
                console.log('RESPONSE', response);
                callback(response);
            }
        });
    };

    var viewFile = (fileName, relatedInfoObject, src) => {
        $('#iframeId' ).attr('src', src);
        $('.ui.basic.doc-viewer.modal').modal('show');
        
        console.log('RO2' ,relatedInfoObject);
        const candidateName = relatedInfoObject.candidateName;
        const cvid = relatedInfoObject.cvid;
        const vid = relatedInfoObject.vid;
        const agencyEmail = relatedInfoObject.agencyEmail;
        const agencyId = relatedInfoObject.agencyId;
        const jobTitle = relatedInfoObject.jobTitle;

        $('.basic-modal-reject').click(function() {

            $('.first.modal.reject-modal')
                .modal('show');

            var $inputs = $('input[name=rejection-reason]');
            $('input[name=rejection-reason]').change(function() {
                if (this.checked)
                    $inputs.not(this).prop('checked', !this.checked);
            });
        }); 

        $('.confirm-rejection-button').off().on('click',function() {
            $('.first.modal.reject').modal('hide');
            $('.second.modal.reject-modal').modal('show', '.first.modal .button');
            $('.second.coupled.modal.accept-modal').modal('hide');

            var reason = $('input[name="rejection-reason"]:checked').val();

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
                        $('.ui.basic.doc-viewer.modal').modal('hide');

                        if ($('.listView').length === 0) {
                            $('.message').html('There are no candidates yet!');
                        }
                    }
                }
            });

        });
        ///reject button on viewer


        $('.basic-modal-accept').click(function() {
  
            $('.ui.basic.doc-viewer.modal').modal('hide');
            //  $('.accept-candidateName').html(candidateName);

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

            $('.modal-submit-acceptance-button').off().on('click', function() {

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
        // accept button viewer 
    };

    // Currently need these as well inorder to be active before the cv viewer is clicked.

    $('.reject-button').click(function() { // reject button 


        const candidateName = $(this).data('candidate-name');
        const cvid = $(this).data('cvid');
        const vid = $(this).data('vid');
        const agencyEmail = $(this).data('agency-email');
        //const agencyId = $(this).data('agency-id');
        //const jobTitle = $(this).data('job-title');

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

            var reason = $('input[name="rejection-reason"]:checked').val();

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
});
