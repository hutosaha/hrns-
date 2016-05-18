'use strict';

var $ = window.$;

$(document).ready(function() {

    $('.cv-viewer').click(function() {
        /// need to write file before iframe injection

        const candidateName = $(this).data('candidate-name');
        const cvid = $(this).data('cvid');
        const vid = $(this).data('vid');
        const agencyEmail = $(this).data('agency-email');
        const agencyId = $(this).data('agency-id');
        const jobTitle = $(this).data('job-title');
        const cvUrl = $(this).data('url');
        const msDocumentTypes = ['doc', 'docx'];

        const ext = cvUrl.substr(cvUrl.lastIndexOf('.')+1);
        // FLOW: checkIfFileNameAlreadyDownloaded
        // If downloaded - open in iframe
        // If not downloaded - downloadFile

        isFileAlreadyDownloaded(cvUrl, (fileName) => {
          console.log(fileName);
          if (fileName !== 'notFound') {
              ext === 'pdf' ? viewFile(fileName) : viewFile(fileName.slice(0, -ext.length) + 'pdf');
          } else {
            console.log('NOT FOUND');
            downloadFile(cvUrl, ext, (fileName) => {
              console.log('DOWNLOADED FILE');
              if (ext === 'pdf') {
                viewFile(fileName);
              } else {
                convertFile(fileName, (response) => {
                  if (response === 'success') {
                    const newFileName = fileName.slice(0, -ext.length) + 'pdf';
                    viewFile(newFileName);
                  } else {
                    alert('An error has occurred, please refresh the page and try again.')
                  }
                });
              }
            });
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

var downloadFile = (cvUrl, ext, callback) => {
  $.ajax({
      url: '/client/download-file',
      data: {
          cvUrl: cvUrl,
          ext: ext
      },
      async: true,
      success: function(response) {
        console.log(response);
        callback(response);
      }
  });
}

function convertFile(fileName, callback){
  console.log('inside convertfile');
  $.ajax({
      url: '/client/convert-file',
      data: {
          fileName: fileName
      },
      async: true,
      success: function(response) {
          callback(response)
      }
  });
}

var viewFile = (fileName) => {
  console.log(fileName);
  var src = "/public/assets/ViewerJS/#../Downloads/" + fileName;
  console.log(src);
  $('iframe').attr('src', src);
  $('.ui.basic.doc-viewer.modal').modal('show');
  // $('.reject').click(rejectApplication());
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

var acceptApplication = () => {

}
