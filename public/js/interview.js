
"use strict";

var $ = window.$;

$(function() {

    DOCUMENTVIEWER.init();
    $('.ui.button.confirm-time').on('click', function() {
        var confirmedIntTime = $(this).data('confirmed-time');
        var confirmedIntDate = $(this).data('confirmed-date');
        var interviewId = $(this).data('interview-id');
        var button = $(this);


        $('.ui.small.modal.save-modal').modal('show');
        $('.save-message').text('Confirm interview Date & Time: ' + confirmedIntDate + ' at ' + confirmedIntTime);

        $('.ui.positive.button').on('click', function() {
            var url = '/interview/confirmed';


            $.ajax({
                method: 'GET',
                url: url,
                async: true,
                data: {
                    confirmedIntDate: confirmedIntDate,
                    confirmedIntTime: confirmedIntTime,
                    interviewId: interviewId
                },
                success: function(res) {
                    if (res) {
                        $('#message').addClass('ui massive info message')
                        .text("Congratulations! We\'ve emailed both parties, the interview is now confirmed, good luck!"); // change to something better...
                        button.removeClass('ui button confirm-date').addClass('ui header green').text('Confirmed');
                        $('.button').remove(); // remove 
                    } else {
                        $('#message').addClass('ui massive warning info message').text('Sorry, there was an error. Please try again!');
                    }

                }
            });
        });

    });
    $('.another-time').on('click', function() {
        var interviewAddress = $(this).data('interview-address');
        var additionalComments = $(this).data('additional-comments');
        var interviewId = $(this).data('interview-id');
        //var candidateName = $(this).data('candidate-name');
        //var jobTitle = $(this).data('jobtitle');


        $('input[name=additionalComments], textarea').text(additionalComments);
        $('input[name=interviewAddress]').val(interviewAddress);

        $('.modal.interview').modal('show');

        $('.send-interview').on('click', function() {

            if ((document.getElementById('firstIntDate').validity.valid) &&
                (document.getElementById('firstIntTime').validity.valid) &&
                (document.getElementById('interviewAddress').validity.valid)
            ) {


                $('.small.modal.save-modal').modal('show');
                var firstIntTime = $('form input[name=firstIntTime').val();
                var firstIntDate = $("form input[name=firstIntDate]").val();
                $('.save-message').text('Please confirm your new first choice of Date & Time for the interview is :' + firstIntDate + ' at ' + firstIntTime);

                $('.ui.positive.button').on('click', function() {

                    var data = $('form').serialize();

                    data = data + '&interviewId=' + interviewId;
                    var url = "/change/interview";
                    $.ajax({
                        method: 'POST',
                        url: url,
                        data: data,
                        async: true,
                        success: function(res) {
                            if (res) {
                                console.log('Changed InterviewData', res);
                                $('#message').addClass('ui massive info message').text("We\'ve emailed yourself and the other party with the new time, please let them confirm");
                                $('.ui.grid.interview').remove();
                            } else {
                                $('#message').addClass('ui warning message').text("Sorry something went wrong please try again");
                            }
                        }
                    });

                });
            } else {
                $('.ui.warning.message').text('Please choose at least one date, time and a location for the interview');
            }
        });

    });
});
