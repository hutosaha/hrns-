var $ = window.$;

$(function() {

    // replaces a link so the admin can't click the button
    $('#go-back').on('click', function() {
        var url = $(this).data('url');


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
        // disable save changes, reject, and go back buttons for Admin. 
        $('button').addClass('disabled');
        $('button').addClass('hide');

    }


    $("input:radio").on('click', function() {
        let cvid = $(this).data('cvid');
        $('#' + cvid).toggleClass('hide-element');
        $('.ui.message.info').removeClass('.ui.info');
        $('#' + cvid).modal('show');

    });

    $('.ui.selection.dropdown')
        .dropdown('select', 'value');

    $('.button.send-interview').on('click', function(e) {
        e.preventDefault();
        const cvid = $(this).data('cvid');
        let form =  document.forms[cvid];
        let firstTime = form['firstIntTime'].value;
        let firstDate = form['firstIntDate'].value;
        let interviewAddress = form['interviewAddress'].value;
        let stage = form['stage'].value;
        let fields = [firstDate, firstTime, interviewAddress, stage];
    
        let validated =  validate(fields);
        
        if ( validated[0] === '' || validated[0] === null ){
            return  $('.message').addClass('ui info').text('We need the date, time, stage and location of the interview'); 
        } else {
            let formData = $('form[name='+cvid+']').each(function(){ $(this).find(':input');});
            return  sendFormData(formData ,cvid);
        }   
    });

    let validate = (fields) => {
        return  fields.filter(checkForEmpty);
    };

    let checkForEmpty =(field) => {
        return field ==''|| field == null;
    };

    let sendFormData = (formData, cvid) => {
        var data = formData.serialize();
        $.ajax({
            type: 'POST',
            url: '/interview/proposed',
            data: data,
            async: true,
            success: function(cvid) {
                if (cvid) {
                    $('#message').addClass('ui info message').text("We\'ve emailed the agent to arrange an interview"); // change to something better...
                    $('#' + cvid).modal('hide');
                    $('form[name='+cvid+']').find("input, textarea").val("");
                } else {
                    $('#' + cvid).modal('hide');
                    document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                }
            },
            error: function(res) {
                console.log("ERROR", res);
                $('#' + cvid).modal('hide');
                document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
            }

        });

    };

    $('.reject-button').click(function() {

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

        $('.confirm-rejection-button').off().on('click', function() {   // only allow one event to trigger ajax
            $('.first.modal.reject').modal('hide');
            $('.second.modal.reject-modal').modal('show', '.first.modal .button');


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
                success: function(cvid) {
                    if (cvid) {
                       document.getElementById(cvid+'row').remove();
                       window.location.reload(true);
                       if ($('.row').length === 0) {
                            $('#message').html('There are no approved candidates at the moment... Come back when there are!');
                        }
                    }
                },
                error: function(res) {
                    console.log("ERROR", res);
                    $('#' + cvid).modal('hide');
                    document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                }
            });

        });
    });
});
