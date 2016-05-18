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

    if ($('.listView').length === 0) { $('.message').html('There are no candidates yet!'); }

    $('.cv-viewer').click(function() {

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

  const candidateName = relatedInfoObject.candidateName;
  const cvid = relatedInfoObject.cvid;
  const vid = relatedInfoObject.vid;
  const agencyEmail = relatedInfoObject.agencyEmail;
  const agencyId = relatedInfoObject.agencyId;
  const jobTitle = relatedInfoObject.jobTitle;

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

 $('.reject-button').click(function() {

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
}
