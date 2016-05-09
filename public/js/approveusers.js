var $ = window.$;

(function() {

	var messageElem = $('#message');

	$('.reject-button').on('click', function(){

		var url = $(this).data('url');
		var id  = $(this).data('id');

		$.ajax({
			url: url,
			async: true,
			success: function (res) {
				messageElem.html(res);
				$('#' + id).remove();
			}
		});

	});

	$('.approve-button').on('click', function(){

		var url = $(this).data('url');
		var id  = $(this).data('id');

		$.ajax({
			url: url,
			async: true,
			success: function (res) {
				messageElem.html(res);
				$('#' + id).remove();
			}
		});

	});

	$('.viewMore').on('click', function(){
		var id = $(this).data('id');
		$(this).parent().parent().parent().find('#' + id).fadeToggle();
  });

	$(':input[type=submit]').on('click',function(){

		event.preventDefault();
		var logo_url= $(this.form).find(':input[type=hidden]').val();
		var id = $(this.form).attr('id');
		var message = $(this.form).find('.message');
			$.ajax({
        url: '/approveusers/clientlogo/',
        data: {
          logo_url: logo_url,
          id: id
        },
        async: true,
        success: function(res) {
           message.hide().html(res).fadeIn('slow');
        }
    });
	});
})();
