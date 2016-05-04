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