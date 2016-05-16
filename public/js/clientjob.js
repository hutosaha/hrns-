'use strict';

var $ = window.$;

$(document).ready(function() {

    $('.cv-viewer').click(function() {
        // need to write file before iframe injection
        console.log('CLICKED');
        var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var agencyEmail = $(this).data('agency-email');
        var agencyId = $(this).data('agency-id');
        var jobTitle = $(this).data('job-title');
        var msDocumentTypes = ['doc', 'docx'];

        // isFileAlreadyDownloaded(cvid, (response) => {
        //     if (response) {
        //           checkFileExtension(fileName, () => {
        //
        //           })
        //     } else {
        //         //get file extension
        //     }
        // });

        getFileName(cvid, (response) => {
          if (response) {
            let fileName = response;
            downloadFile(fileName, cvid, (response) => {
                console.log('downloaded');
            })
          };
        })
    });

});

// var isFileAlreadyDownloaded = (cvid, callback) => {
//     //AJAX request to do fs.readdirSync --> check if file already exists
//     $.ajax({
//         url: '/client/file-exists',
//         data: {
//             cvid: cvid,
//         },
//         async: true,
//         success: function(response) {
//           console.log('!!!!!', response);
//           callback(response);
//         }
//     });
// }

var getFileName = (cvid, callback) => {
  $.ajax({
      url: '/client/get-filename',
      data: {
          cvid: cvid,
      },
      async: true,
      success: function(response) {
        console.log('!!!!!', response);
        callback(response);
      }
  });
}

var downloadFile = (fileName, cvid, callback) => {
    $.ajax({
        url: '/client/get-file-from-s3',
        data: {
            fileName: fileName,
            cvid: cvid
        },
        async: true,
        success: function(response) {
          console.log('YESYESYES', response);
          callback(response);
        }
    });
}

// var findFileExtensionFor = (cvid) => {
//
//   $.ajax({
//       url: '/client/get-cv',
//       data: {
//           cvid: cvid,
//       },
//       async: true,
//       success: function(res) {
//         console.log('!!!!!', res);
//       }
//   });
// }
