'use strict';

var $ = window.$;

$(function() {
$('.ui.dropdown')
    .dropdown('set selected', 'value');

$('#submitRatings').on('click', function() {
    var allInputs = $(":input[type=hidden]");

    allInputs.each(function() {
        var rating = $(this).val();
        var cvid = $(this).attr("id");
        var vid = $(this).attr("name");
        var aEmail = $(this).attr("data-aEmail");
        console.log('allInputs', rating, vid, cvid, aEmail);

        if(rating){
              $.ajax({
                  url: '/rating/',
                  data: {
                      cvid: cvid,
                      vid: vid,
                      rating: rating,
                      email: aEmail
                  },
                  async:true,
                  success: function(data) {
                    $('#candidates').html('<h3>'+data+'<h3>');
                  },
                  error:function(thrownError){
                       console.log(thrownError);
                  }
          });
        }
    });
  });

});
