var $ = window.$;

$(function() {

    $('.ui.button.confirm-time').on('click', function() {
        var confirmedTime = $(this).data('confirmed-time');
        var confirmedDate = $(this).data('confirmed-date');
        var interviewId = $(this).data('interview-id');

        $('.ui.small.modal.save-modal').modal('show');

        $('.ui.positive.button').on('click', function() {
            var url = '/interview/confirmed';


            $.ajax({
                method: 'GET',
                url: url,
                async: true,
                data: {
                    confirmedDate: confirmedDate,
                    confirmedTime: confirmedTime,
                    interviewId: interviewId
                },
                success: function(res) {
                    if (res) {
                        $('#message').addClass('ui info message').text("We\'ve emailed the client to arrange an interview"); // change to something better...)
                    } else {
                        document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                    }

                }
            });
        });

    });
    $('.another-time').on('click', function() {
        var interviewAddress = $(this).data('interview-address');
        var additionalComments = $(this).data('additional-comments');
        var interviewId = $(this).data('interview-id');
        var candidateName = $(this).data('candidate-name');
        var jobTitle = $(this).data('jobtitle');


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
                    $('.save-message').text('Please confirm your first choice Date & Time:'+firstIntDate+' at '+firstIntTime);

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
                                $('#message').addClass('ui info message').text("We\'ve emailed the other party to suggest another time for the interview");
                                $('.firstIntDate').text(res.firstIntDate);
                                $('.firstIntTime').text(res.firstIntTime);
                                $('.secondIntDate').text(res.secondIntDate);
                                $('.secondIntTime').text(res.secondInTime);
                                $('.thirdIntDate').text(res.thirdIntDate);
                                $('.thirdIntTime').text(res.thirdInTime);
                                $('.additionalComments').text(res.additionalComments); 
                                $('.interviewAddress').text(res.interviewAddress);
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
