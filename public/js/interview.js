var $ = window.$;

$(function() {	

	$('.ui.button.confirm-time').on('click', function(){
            var confirmedTime = $(this).data('confirmed-time');
            var confirmedDate = $(this).data('confirmed-date');
            var appointmentId = $(this).data('appointment-id');
            
        $('.ui.small.modal.save-modal').modal('show');

        $('.ui.positive.button').on('click', function() {
			var url = '/appointment/confirmed';
	
		
			$.ajax({
                method:'GET',
                url : url,
                async: true,
                data: {
                    confirmedDate: confirmedDate, 
                    confirmedTime: confirmedTime, 
                    appointmentId: appointmentId 
                },
                success: function(res) {
                            if (res) {
                                $('#message').addClass('ui info message');
                                document.getElementById('message').innerHTML = "We\'ve emailed the clinet to arrange an appointment"; // change to something better...
                            } else {
                                document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                            }

                }   
            });
		});

	});
	$('.another-time').on('click',function(){
        var interviewAddress = $(this).data('interview-address');
        var additionalComments =$(this).data('additional-comments');
        var appointmentId = $(this).data('appointment-id');
        var candidateName = $(this).data('candidate-name');
        var jobTitle      = $(this).data('jobtitle');


        $('input[name=additionalComments], textarea').text(additionalComments);
        $('input[name=interviewAddress]').val(interviewAddress);

		 $('.modal.appointment').modal('show');
		 
		 $('.send-appointment').on('click', function() {

            $('.small.modal.save-modal').modal('show');

            $('.ui.positive.button').on('click', function() {

                var data = $('form').serialize();
           
                data = data+'&appointmentId='+appointmentId;
                var url = "/change/appointment";
                $.ajax({
                        method: 'POST',
                        url: url,
                        data: data,
                        async: true,
                        success: function(res) {
                            if (res) {
                                $('#message').addClass('ui info message');
                                document.getElementById('message').innerHTML = "We\'ve emailed the clinet to arrange an appointment"; // change to something better...
                            } else {
                                document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                            }

                        }               
                });

            });
        });

	});
});