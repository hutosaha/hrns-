'use strict';

var $ = window.$;

window.onbeforeunload = () => {
  $.ajax({
      url: '/client/clear-downloads',
      async: true,
      success: function(response) {
        console.log('!!!!!', response);
      }
  });
}

$(document).ready(function() {


    if ($('.listView').length === 0) {
        $('.message').html('There are no candidates yet!');
    }

    $('.cv-viewer').click(function() {
        /// need to write file before iframe injection

        const relatedInfoObject = {
          candidateName: $(this).data('candidate-name'),
          cvid: $(this).data('cvid'),
          vid: $(this).data('vid'),
          agencyEmail: $(this).data('agency-email'),
          agencyId: $(this).data('agency-id'),
          jobTitle: $(this).data('job-title')
        };
        const cvUrl = $(this).data('url')
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
                viewFile(fileName, relatedInfoObject);
              } else {
                convertFile(fileName, (response) => {
                  if (response === 'success') {
                    const newFileName = fileName.slice(0, -ext.length) + 'pdf';
                    viewFile(newFileName, relatedInfoObject);
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

var convertFile = (fileName, callback) => {
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

var viewFile = (fileName, relatedInfoObject) => {
  console.log(fileName);
  var src = "/public/assets/ViewerJS/#../Downloads/" + fileName;
  console.log(src);
  $('iframe').attr('src', src);
  $('.ui.basic.doc-viewer.modal').modal('show');
}
