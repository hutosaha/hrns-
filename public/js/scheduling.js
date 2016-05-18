    var $ = window.$;

$(function() {

    // replaces a link so the admin can't click the button
    $('#go-back').on('click', function() {
        var url = $(this).data('url');
        console.log('boom url', url);

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
        $('button').addClass('hide');

    }

    $("input:radio").on('click', function() {
        var $radio = $(this);
        var cvid = $(this).attr('name');
        var stage = $(this).data('stage');
        var agencyId = $(this).closest('.listView').data('agency-id');
        var agencyEmail = $(this).closest('.listView').data('agency-email');
        var candidateName = $(this).closest('.listView').data('candidate-name');
        var jobTitle = $(this).closest('.listView').data('job-title');
        var companyName = $('.ui.block.header').data('company-name');
        var vid = $(this).closest('.listView').data('vid');
        
        $('.modal.interview').modal('show');

        if ($radio.is(":checked")) {
            var group = "input:radio[name='" + cvid + "']";
            $(group).prop("checked", false);
            $radio.prop("checked", true);
        } else {
            $radio.prop("checked", false);
        }
            
        $('.send-interview').on('click', function() {
         

            if ( (document.getElementById('firstIntDate').validity.valid) && 
                 (document.getElementById('firstIntTime').validity.valid) &&
                 (document.getElementById('interviewAddress').validity.valid)
            ){
           

                $('.modal.interview').modal('hide');
                $('.ui.small.save-modal').modal('show');

                $('.ui.positive.button').on('click',function(){ 

                    var data = $('form').serialize();
                    var agencyData = {
                        agencyEmail: agencyEmail,
                        agencyId: agencyId,
                        stage: stage,
                        vid: vid,
                        cvid: cvid,
                        candidateName: candidateName,
                        jobTitle: jobTitle,
                        companyName: companyName
                    };
                    data = data+'&'+$.param(agencyData);
                    var url = "/interview/proposed";
                    $.ajax({
                            type: 'POST',
                            url: url,
                            data: data,
                            async: true,
                            success: function(res) {
                                if (res) {    
                                    $('#message').addClass('ui info message').text("We\'ve emailed the agent to arrange an interview"); // change to something better...
                                    $('form input').forEach((ele) =>  ele.val(''));
                                } else {
                                    document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                                }
                            } ,
                            error: function(res) {
                                console.log("ERROR", res);
                                document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';                              
                            }              
                    });
                });
            }else {
                $('.ui.warning.message').text('Please choose at least one date, time and a location for the interview');
            }
            
        });

    });

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

        $('.confirm-rejection-button').click(function() {
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
                success: function(res) {
                    if (res) {

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
});
