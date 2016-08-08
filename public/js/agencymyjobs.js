"use strict";

var $ = window.$;

(function() {

    $('.coupled.modal.reject-modal')
        .modal({
            allowMultiple: false
        });

    $('.remove-button').click(function() {
       
        var vid = $(this).data('vid');
     

        $('.first.modal.reject-modal')
            .modal('show');

        $('.button.cancel-rejection').click(function() {
            $('.first.modal.reject-modal').modal('hide');
        });


        $('.button.confirm-rejection').click(function() {
            $('.first.modal.reject').modal('hide');
            $('.second.modal.reject-modal').modal('show', '.first.modal .button');


            $.ajax({
                url: '/agency/myjobs/remove',
                data: {
                    vid: vid                
                },
                async: true,
                success: function(res) {
                    if (res) {
                        var ele = document.getElementById(vid);
                        if (ele) { ele.remove(); }
                        var vacanciesCount = $(".listView");
                        if (vacanciesCount.length === 0) {
                           $('.overview-heading').remove();
                           $('#message').html('None of your candidates have been moved to scheduling by any clients');

                        }
                    } else {
                        $('#message').html('Error please try again');
                    }

                },
                error: function(thrownError) {
                    console.log(thrownError);
                }
            });


        });



    });
})();
