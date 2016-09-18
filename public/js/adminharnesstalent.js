
var $ = window.$;

$(function() {

    $('.ui.inverted.blue.button.accept').click(function(e){
        var cvid = e.target.id;
        $('.ui.small.modal.save-modal').modal('show');
        $('.ui.positive.right.labeled.icon.button').click(function(){
            console.log('cvid', cvid);
            var url = '/harnesstalent/accepted/'+cvid;
            $.ajax({
                url: url,
                async: true,
                success: function(res) {
                    $('#message').html(res);
                    $('#'+ cvid+'row').remove();
                }
            });
        });
    });
  
    $('.reject').click(function(e) {
    	var cvid = e.target.id;
        $('.ui.first.coupled.modal.reject-modal').modal('show');

        var $inputs = $('input[name=rejection-reason]');
        
        $('input[name=rejection-reason]').change(function() {
            if (this.checked)
                $inputs.not(this).prop('checked', !this.checked);
        });       
   

	    $('.button.confirm-rejection-button').click(function(){
	        $('.ui.first.coupled.modal.reject-modal').modal('hide');
	        $('.second.modal.reject-modal').modal('show', '.first.modal .button');
	        $('.second.coupled.modal.accept-modal').modal('hide');

	       	var reason = $('input[name=rejection-other-reason]').val();

	       	if(reason === ""){
 				reason = $('input[name="rejection-reason"]:checked').val();
	       	}

            $.ajax({
                url: '/harnesstalent/reject',
                data:{
                	cvid:cvid,
                	reason:reason
                },
             	async: true,
                success: function(res) {
                    if (res) {
                        var element = document.getElementById(cvid +'row');
                        element.remove();
                        if ($('.listView').length === 0) {
                            $('#message').html('There are no candidates yet!');
                        }
                        $('#message').html(res);
                    }
                }
            });
        });
	});
});
