'use strict';

var $ = window.$;

var DOCUMENTVIEWER = {
    init: function() {
        this.cvViewer();
        this.clearDownloads();
    },
    clearDownloads: function() {
        $.ajax({
            url: '/client/clear-downloads',
            async: true,
            success: function(response) {
                console.log(response);
            }
        });
    },
    cvViewer: function() {
        let self = this;
        $('.cv-viewer').on('click', function(e) {

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

            self.isFileAlreadyDownloaded(cvUrl, (fileName) => {

                if (fileName !== 'notFound') {

                    var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;
                    var word = "https://view.officeapps.live.com/op/embed.aspx?src=www.harnesstalent.com/public/assets/downloads/" + fileName;
                    ext === 'pdf' ? self.viewFile(fileName, relatedInfoObject, pdf) : self.viewFile(fileName, relatedInfoObject, word);
                } else {
                    self.downloadFile(cvUrl, ext, (fileName) => {
                        console.log('EXT', ext, fileName);
                        var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;
                        var word = "https://view.officeapps.live.com/op/embed.aspx?src=www.harnesstalent.com/public/assets/downloads/" + fileName;
                        ext === 'pdf' ? self.viewFile(fileName, relatedInfoObject, pdf) : self.viewFile(fileName, relatedInfoObject, word);

                    });
                }
            });
        });
    },
    isFileAlreadyDownloaded: function(cvUrl, callback) {
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

    },
    downloadFile: function(cvUrl, ext, callback) {
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
    },
    viewFile: function(fileName, relatedInfoObject, src) {
        $('#iframeId').attr('src', src);
        $('.ui.basic.doc-viewer.modal').modal('show');

        this.acceptButton(relatedInfoObject);
        this.rejectButton(relatedInfoObject);
    },
    acceptButton: function(relatedInfoObject) {
        let cvid = relatedInfoObject.cvid;
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

            $('.modal-submit-acceptance-button').click(function() {
                $('.first.coupled.modal.accept-modal').hide(); /// need the confirmation 
                $.ajax({
                    url: '/client/job/accept',
                    data: relatedInfoObject,
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
    },
    rejectButton: function(relatedInfoObject) {
        let cvid = relatedInfoObject.cvid;

        $('.basic-modal-reject').click(function() {

            $('.first.modal.reject-modal')
                .modal('show');

            var $inputs = $('input[name=rejection-reason]');
            $('input[name=rejection-reason]').change(function() {
                if (this.checked)
                    $inputs.not(this).prop('checked', !this.checked);
            });
        });

        $('.confirm-rejection-button').off().on('click', function() {
            $('.first.modal.reject').modal('hide');
            $('.second.modal.reject-modal').modal('show', '.first.modal .button');
            $('.second.coupled.modal.accept-modal').modal('hide');

            var reason = $('input[name="rejection-reason"]:checked').val();

            relatedInfoObject.list = 'clientShorlist';
            relatedInfoObject.reason = reason;

            $.ajax({
                url: '/client/scheduling/reject',
                data: relatedInfoObject,
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

    }

}








// Currently need these as well inorder to be active before the cv viewer is clicked.
