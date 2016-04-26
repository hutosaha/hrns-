var $ = window.$;

(function() {

	$('.viewMore').on('click', function(){
		$(this).parent().parent().parent().find('form').fadeToggle();
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
