'use strict';

var $ = window.$;

$(function() {
    $('.ui.dropdown')
        .dropdown('set selected', 'value');


    $('#submitRatings').on('click', function() {

        $('.first.modal.confirmation-modal')
            .modal('show');

        $('.button.cancel-confirmation').click(function() {
            $('.ui.first.modal.confirmation-modal').modal('hide');
        });
    });

    $("input[type=hidden]").on('change', function(){
        $('#submitRatings').addClass('active');
    });


    $('.button.savechanges-confirmation').click(function() {
        $('.ui.first.modal.confirmation-modal').modal('hide');
        $('.second.modal.confirmation-modal').modal('show', '.first.modal .button');

        var allInputs = $(":input[type=hidden]");
        allInputs.each(function() {

            var rating = $(this).val();

            if (rating) {

                var cvid = $(this).attr("id");
                var vid = $(this).attr("name");
                var agencyEmail = $(this).data("agency-email");

                $.ajax({
                    url: '/rating/',
                    data: {
                        cvid: cvid,
                        vid: vid,
                        rating: rating,
                        agencyEmail: agencyEmail
                    },
                    async: true,
                    success: function(res) {
                        if (res) {
                            var ele = document.getElementById(cvid);
                            if (ele) { ele.remove(); }
                            var inputCount = $(":input[type=hidden]");

                            if (inputCount.length === 0) {
                                document.getElementById('submitRatings').style.display = 'none';
                                $('#message').html('There are no candidates to approve for this vacancy');
                            }
                        } else {
                            $('#message').html('Error please try again');
                        }

                    },
                    error: function(thrownError) {
                        console.log(thrownError);
                    }
                });
            } else {
               console.log('Has No Rating')
            }
        });
    });


    $('.coupled.modal.reject-modal')
        .modal({
            allowMultiple: false
        });

    $('.button.reject').on('click', function() {

        let cvid = $(this).data('cvid');
        let vid = $(this).data('vid');
        let agencyEmail = $(this).data('agency-email');

        $('.first.modal.reject-modal')
            .modal('show');

        $('.button.cancel-rejection').click(function() {
            $('.first.modal.reject-modal').modal('hide');
        });


        $('.button.confirm-rejection').click(function() {
            $('.first.modal.reject').modal('hide');
            $('.second.modal.reject-modal').modal('show', '.first.modal .button');


            $.ajax({
                url: '/admin/job/reject',
                data: {
                    cvid: cvid,
                    vid: vid,
                    agencyEmail: agencyEmail
                },
                async: true,
                success: function(res) {
                    if (res) {
                        var ele = document.getElementById(cvid);
                        if (ele) { ele.remove(); }
                        var applicationsCount = $(".listView");
                        if (applicationsCount.length === 0) {
                            document.getElementById('submitRatings').style.display = 'none';
                            $('#message').html('There are no candidates for you to approve at the moment... come back when there are!');
                        }
                    } else {
                        $('#message').html('Error please try again');
                    }

                },
                error: function(thrownError) {
                    console.log(thrownError);
                }
            });
        });
    });
});
