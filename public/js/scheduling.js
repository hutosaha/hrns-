// Needs to change?

'use strict';

const $ = window.$;

$(function() {
    $('.ui.dropdown')
        .dropdown('set selected', 'value');

    $("input").change(function() {
        var stage = $(this).val();
        var cvid = $(this).attr("id");
        var vid =$(this).attr("name");
        $.ajax({
            // current URL in backend is '/client/job/{vid}/scheduling/update'
            url:"/progress/"+cvid+'/'+vid+'/'+stage,
            success: function(data) {
              console.log('DATA', JSON.parse(data));
              alert('moved onto the next stage ' + JSON.parse(data));
            }
        });
     });
});
