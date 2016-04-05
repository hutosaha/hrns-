'use strict';

var $ = window.$;

$(document).ready(function() {
    var text_max = 500; // defined in joiSchema.js
    $('#textarea_feedback').html(text_max + ' characters remaining');

    $('#companyDescription').keyup(function() {
        var text_length = $('#companyDescription').val().length;
        var text_remaining = text_max - text_length;

        $('#textarea_feedback').html(text_remaining + ' characters remaining');
    });
  });
