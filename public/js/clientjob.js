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
        var cvUrl = $(this).data('url');
        var msDocumentTypes = ['doc', 'docx'];

        const ext = cvUrl.substr(cvUrl.lastIndexOf('.')+1);

        // FLOW: checkIfFileNameAlreadyDownloaded
        // If downloaded - open in iframe
        // If not downloaded - downloadFile

        isFileAlreadyDownloaded(cvUrl, (filePath) => {
          if (filePath !== 'notFound') {
            console.log('FILE FOUND');
            openViewer(filePath);
            // checkFileExtension(fileName, () => {
            //
            // })
          } else {
            console.log('NOT FOUND :\'\()');
            downloadFile(cvUrl, (filePath) => {

            })
          }
        });

    });
});

var isFileAlreadyDownloaded = (cvUrl, callback) => {
//AJAX request to do fs.readdirSync --> check if file already exists
  $.ajax({
      url: '/client/file-exists',
      data: {
          cvUrl: cvUrl,
      },
      async: true,
      success: function(response) {
        console.log('!!!!!', response);
        callback(response);
      }
  });
}

var downloadFile = (filePath, callback) => {
}


var openViewer = (filePath) => {
  var src = "/public/assets/ViewerJS/#../Downloads/" + filePath;
  $('iframe').attr('src', src);
  $('.ui.basic.doc-viewer.modal').modal('show');
}

var rejectApplication = () => {
  $('.first.modal.reject-modal').modal('show');

  var $inputs = $('input[name=rejection-reason]');
  $('input[name=rejection-reason]').change(function() {
      if (this.checked) $inputs.not(this).prop('checked', !this.checked);
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
}
