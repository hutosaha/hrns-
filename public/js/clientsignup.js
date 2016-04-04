'use strict';

let $ = window.$;

$(document).ready(function() {
    let text_max = 500;
    $('#textarea_feedback').html(text_max + ' characters remaining');

    $('#companyDescription').keyup(function() {
        let text_length = $('#companyDescription').val().length;
        let text_remaining = text_max - text_length;

        $('#textarea_feedback').html(text_remaining + ' characters remaining');
    });
  });
