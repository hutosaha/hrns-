var $ = window.$;

$(function() {	
	var appointmentId = $(this).data('.ui.grid.interview')
	$('.ui.button.confirm-time').on('click', function(){
        console.log('boom');
        $('.ui.small.modal.save-modal').modal('show');

        $('.ui.positive.button').on('click', function() {
			var url = '/appointment/confirmed';
			var confirmedTime = $(this).data('confirmed-time');
			var confirmedDate = $(this).data('confirmed-date');
		
			$.get(url,{confirmedDate: confirmedDate, confirmedTime: confirmedTime, appointmentId: appointmentId })
		});

	});
	$('.another-time').on('click',function(){
        var interviewAddress = $(this).data('interview-address');
        var additionalComments =$(this).data('additional-comments');
        $('input[name=additionalComments], textarea').text(additionalComments);
        $('input[name=interviewAddress]').val(interviewAddress);

		 $('.modal.appointment').modal('show');
		 
		 $('.send-appointment').on('click', function() {

            $('.small.modal.save-modal').modal('show');

            $('.ui.positive.button').on('click', function() {

                var data = $('form').serialize();
           
                data = data+'&appointmentId='+appointmentId;
                var url = "/scheduling/appointment";
                $.ajax({
                        method: 'POST',
                        url: url,
                        data: data,
                        async: true,
                        success: function(res) {
                            if (res) {
                                $('#message').addClass('ui info message');
                                document.getElementById('message').innerHTML = "We\'ve emailed the agent to arrange an appointment"; // change to something better...
                            } else {
                                document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                            }

                        }               
                });

            });
        });

	});
});