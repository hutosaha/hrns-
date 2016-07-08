"use strict";

var $ = window.$;

$(function() {

    $('.ui.inverted.blue.button.accept').click((e) => {
        let cvid = e.target.id;
        $('.ui.small.modal.save-modal').modal('show');
        $('.ui.positive.right.labeled.icon.button').click(() => {
            console.log('cvid', cvid);
            let url = '/harnesstalent/accpeted/'+cvid;
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
  
    $('.reject').click((e)=> {
    	let cvid = e.target.id;
        $('.ui.first.coupled.modal.reject-modal').modal('show');

        let $inputs = $('input[name=rejection-reason]');
        $('input[name=rejection-reason]').change(function() {
            if (this.checked)
                $inputs.not(this).prop('checked', !this.checked);
        });
   

	    $('.button.confirm-rejection-button').click(() => {
	        $('.ui.first.coupled.modal.reject-modal').modal('hide');
	        $('.second.modal.reject-modal').modal('show', '.first.modal .button');
	        $('.second.coupled.modal.accept-modal').modal('hide');

	        let reason = $('input[name="rejection-reason"]:checked').val();

            $.ajax({
                url: '/harnesstalent/reject',
                data:{
                	cvid:cvid,
                	reason:reason
                },
             	async: true,
                success: function(res) {
                    if (res) {
                        let element = document.getElementById(cvid +'row');
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
