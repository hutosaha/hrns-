var $ = window.$;

$(function() {

    $("input:radio").on('click', function(){
          var $radio =$(this);
          var cvid = $(this).attr('name');

          if($radio.is(":checked")) {
              var group ="input:radio[name='"+cvid+"']";
              $(group).prop("checked", false);
              $radio.prop("checked",true);
          } else {
              $radio.prop("checked",false);
          }
    });

    $('#save-changes').on('click', function(e) {
      e.preventDefault();

      $("input:radio:checked").each(function() {

        var stage = $(this).data('stage');
        var cvid  = $(this).data('cvid');
        var vid   = window.location.pathname.split('/client/scheduling/')[1];

        $.ajax({
          url: '/client/scheduling/' + vid + '/update',
          data: {
            stage: stage,
            cvid: cvid
          },
          async: true,
          success: function(res) {
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
