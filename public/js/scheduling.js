// this logic will be used on our scheduling page
// we'll use similar logic on client/job and admin/job

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
            url:"/progress/"+cvid+'/'+vid+'/'+stage, // url for backend
            success: function(data) {
              console.log('DATA', JSON.parse(data));
              alert('moved onto the next stage ' + JSON.parse(data));
            }
        });
     });
});
