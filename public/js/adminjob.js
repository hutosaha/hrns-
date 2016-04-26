'use strict';

var $ = window.$;

$(function() {
    $('.ui.dropdown')
        .dropdown('set selected', 'value');

    var allInputs = $(":input[type=hidden]");
    $('#submitRatings').on('click', function() {


        allInputs.each(function() {

            var rating = $(this).val();

            if (rating) {

                var cvid = $(this).attr("id");
                var vid = $(this).attr("name");
                var aEmail = $(this).attr("data-aEmail");

                console.log('allInputs', rating, vid, cvid, aEmail);
                $.ajax({
                    url: '/rating/',
                    data: {
                        cvid: cvid,
                        vid: vid,
                        rating: rating,
                        email: aEmail
                    },
                    async: true,
                    success: function( data) {
                        var ele = document.getElementById(cvid);
                        if(ele) { ele.remove();}
                        var inputCount = $(":input[type=hidden]");
                        console.log('ALLINPUTS', inputCount.length);

                        if (inputCount.length === 0) {
                            document.getElementById('submitRatings').style.display = 'none';
                            $('#message').html(data);
                        }

                    },
                    error: function(thrownError) {
                        console.log(thrownError);
                    }
                });
            } else {
                console.log('!Rating', rating);
            }
        });
    });
});
