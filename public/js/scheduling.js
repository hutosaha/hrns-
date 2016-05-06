var $ = window.$;

$(function() {

    // replaces a link so the admin can't click the button
    $('#go-back').on('click', function() {
        var url = $(this).data('url');
        console.log('boom url',url);

        window.location.replace(url);
      });

    // function for getting query string
    function getParameterByName(name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, "\\$&");
      var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
          results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    if (getParameterByName('type') === 'admin') {
      // disable save changes, reject, and go back buttons
      $('button').addClass('disabled');
    }

    $("input:radio").on('click', function() {
        var $radio = $(this);
        var cvid = $(this).attr('name');

        if ($radio.is(":checked")) {
            var group = "input:radio[name='" + cvid + "']";
            $(group).prop("checked", false);
            $radio.prop("checked", true);
        } else {
            $radio.prop("checked", false);
        }
    });

    $("input:radio").on('change', function(){
        $('#save-changes').addClass('active');
    });

    $('#save-changes').on('click', function(e) {
        e.preventDefault();
        $('.small.modal.save-modal').modal('show');
    });

    $('.ui.positive.button').on('click', function() {

        $("input:radio:checked").each(function() {

            var stage = $(this).data('stage');
            var cvid = $(this).data('cvid');
            var vid = window.location.pathname.split('/client/scheduling/')[1].split('/')[0];

            $.ajax({
                url: '/client/scheduling/' + vid + '/update',
                data: {
                    stage: stage,
                    cvid: cvid
                },
                async: true,
                success: function(res) {
                    if (res) {
                        $('#message').addClass('ui info message');
                        document.getElementById('message').innerHTML = 'Your changes have been saved'; // change to something better...
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

    $('.reject-button').click(function() {

      console.log('1');

        var candidateName = $(this).data('candidate-name');
        var cvid = $(this).data('cvid');
        var vid = $(this).data('vid');
        var currentStage = $(this).data('current-stage');
        var agencyEmail = $(this).data('agency-email');
        var agencyId = $(this).data('agency-id');

        if (candidateName) {
            $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
        }

        $('.ui.checkbox').checkbox();

        $('.coupled.modal.reject-modal').modal({ allowMultiple: false });
        $('.second.modal.reject-modal').modal('attach events', '.first.modal .button');
        $('.first.modal.reject-modal').modal('show');

        var $inputs = $('input[name=rejection-reason]');

        $('input[name=rejection-reason]').change(function() {
            if (this.checked) {
              $inputs.not(this).prop('checked', !this.checked);
            }
        });

        $('.confirm-rejection-button').click(function() {
                $('.first.modal.reject').modal('hide');
                $('.second.modal.reject-modal').modal('show', '.first.modal .button');

                console.log('2');


            var reason = $('input[name="rejection-reason"]:checked').val();

            $.ajax({
                url: '/client/scheduling/reject',
                data: {
                    candidateName: candidateName,
                    cvid: cvid,
                    vid: vid,
                    email: agencyEmail,
                    agencyId: agencyId,
                    reason: reason,
                    stage: currentStage
                },
                async: true,
                success: function(res) {
                    if (res) {
                      console.log('3');

                        var element = document.getElementById(cvid);
                        element.nextSibling.nextSibling.remove();
                        element.remove();

                        if ($('.listView').length === 0) {
                            $('.message').html('There are no approved candidates at the moment... Come back when there are!');
                        }
                    }
                }
            });

        });
    });
})();
