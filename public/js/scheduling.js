var $ = window.$;

$(function() {

        // replaces a link so the admin can't click the button
        $('#go-back').on('click', function() {
            var url = $(this).data('url');


            window.location.replace(url);
        });

        // function for getting query string
        function getParameterByName(name, url) {
            if (!url) url = window.location.href;
            name = name.replace(/[\[\]]/g, "\\$&");
            var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
                results = regex.exec(url);
            if (!results) return null;
            if (!results[2]) return '';
            return decodeURIComponent(results[2].replace(/\+/g, " "));
        }

        if (getParameterByName('type') === 'admin') {
            // disable save changes, reject, and go back buttons for Admin. 
            $('button').addClass('disabled');
            $('button').addClass('hide');

        }

     

     
        $("input:radio").on('click', function() {
            let cvid = $(this).data('cvid');
            $('#'+cvid).toggleClass('hide-element');
            $('#'+cvid).modal('show');

        });
        $('.stage.dropdown').dropdown('set selected','value');

        $('.reject-button').click(function() {

            var candidateName = $(this).data('candidate-name');
            var cvid = $(this).data('cvid');
            var vid = $(this).data('vid');
            var currentStage = $(this).data('current-stage');
            var agencyEmail = $(this).data('agency-email');
            var agencyId = $(this).data('agency-id');

            if (candidateName) {
                $('#modal-heading').html('Sorry to hear you want to reject ' + candidateName);
            }

            $('.ui.checkbox').checkbox();

            $('.coupled.modal.reject-modal').modal({ allowMultiple: false });
            $('.second.modal.reject-modal').modal('attach events', '.first.modal .button');
            $('.first.modal.reject-modal').modal('show');

            var $inputs = $('input[name=rejection-reason]');

            $('input[name=rejection-reason]').change(function() {
                if (this.checked) {
                    $inputs.not(this).prop('checked', !this.checked);
                }
            });

            $('.confirm-rejection-button').click(function() {
                $('.first.modal.reject').modal('hide');
                $('.second.modal.reject-modal').modal('show', '.first.modal .button');


                var reason = $('input[name="rejection-reason"]:checked').val();

                $.ajax({
                    url: '/client/scheduling/reject',
                    data: {
                        candidateName: candidateName,
                        cvid: cvid,
                        vid: vid,
                        email: agencyEmail,
                        agencyId: agencyId,
                        reason: reason,
                        stage: currentStage
                    },
                    async: true,
                    success: function(res) {
                        if (res) {

                            var element = document.getElementById(cvid);
                            element.nextSibling.nextSibling.remove();
                            element.remove();

                            if ($('.listView').length === 0) {
                                $('.message').html('There are no approved candidates at the moment... Come back when there are!');
                            }
                        }
                    }
                });

            });
        });
});
