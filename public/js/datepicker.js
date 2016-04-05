 'use strict';

var $ = window.$;

var Modernizr = window.Modernizr;

$(function() {
  if (!Modernizr.inputtypes['date']) {
    console.log('i\'m in the if');
    $('input[type=date]').datepicker({
      dateFormat: 'yy-mm-dd'
    });
  }
});
