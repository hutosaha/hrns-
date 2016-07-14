'use strict';

var $ = window.$;

var DOCUMENTVIEWER = {
    init: function() {
        this.clearDownloads();
        this.cvViewer();
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

        $('.cv-viewer').on('click', function(e) {
            console.log('hello i\'m clicked');
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

            DOCUMENTVIEWER.isFileAlreadyDownloaded(cvUrl, (fileName) => {

                if (fileName !== 'notFound') {

                    var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;
                    var word = "https://view.officeapps.live.com/op/embed.aspx?src=www.harnesstalent.com/public/assets/downloads/" + fileName;
                    ext === 'pdf' ? DOCUMENTVIEWER.viewFile(fileName, relatedInfoObject, pdf) : DOCUMENTVIEWER.viewFile(fileName, relatedInfoObject, word);
                } else {
                    DOCUMENTVIEWER.downloadFile(cvUrl, ext, (fileName) => {
                        console.log('EXT', ext, fileName);
                        var pdf = "/public/assets/ViewerJS/#../downloads/" + fileName;
                        var word = "https://view.officeapps.live.com/op/embed.aspx?src=www.harnesstalent.com/public/assets/downloads/" + fileName;
                        ext === 'pdf' ? DOCUMENTVIEWER.viewFile(fileName, relatedInfoObject, pdf) : DOCUMENTVIEWER.viewFile(fileName, relatedInfoObject, word);

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

        console.log('RO2', relatedInfoObject);
        const candidateName = relatedInfoObject.candidateName;
        const cvid = relatedInfoObject.cvid;
        const vid = relatedInfoObject.vid;
        const agencyEmail = relatedInfoObject.agencyEmail;
        const agencyId = relatedInfoObject.agencyId;
        const jobTitle = relatedInfoObject.jobTitle;         
    }

}








// Currently need these as well inorder to be active before the cv viewer is clicked.
