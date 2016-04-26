var $ = window.$;

$(function() {

    $('#save-changes').on('click', function(e) {
      e.preventDefault();

      $("input:radio:checked").each(function() {

        var stage = $(this).data('stage');
        var cvid  = $(this).data('cvid');
        var vid   = window.location.pathname.split('/client/job/')[1].split('/scheduling')[0];

        console.log('FE stage', stage);

        $.ajax({
          url: '/client/job/' + vid + '/scheduling/update',
          data: {
            stage: stage,
            cvid: cvid
          },
          async: true,
          success: function(res) {
            console.log('FE res', res);
            if (res) {
              document.getElementById('message').innerHTML = 'Worked!'; // change to something better...
            } else {
              document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
            }
          },
          error: function() {
            document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
          }
        });
      });
    });
});
