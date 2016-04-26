'use strict';

var $ = window.$;

 $('.menu .item').tab();

 $('.viewMore').on('click', function(){
   var id = $(this).data('id');
   $(this).parent().parent().parent().find('#' + id).fadeToggle();
 });
