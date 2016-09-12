var $navbar = $('.navBgColor');
$(document).scroll(function() {
    $navbar.css({'background-color': $(this).scrollTop() > 300? "black":"none" })
});