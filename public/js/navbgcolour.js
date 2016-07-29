var $navbar = $('.navBgColor');
$(document).scroll(function() {
    $navbar.css({'background-color': $(this).scrollTop() > 300? "rgba(0, 0, 0, 0.4)":"none" })
});