'use strict';

var $ = window.$;

(function() {

    var CANDIDATES = {
        init: function() {
            this.fetch();
            this.search();
            this.reset();
            this.interviewRequest();
        },
        fetch: function(query) {
            $.ajax({
                url: '/harnesstalent/results',
                data: query,
                success: function(response) {
                    if(response === false){
                        $('.ui.message').text('There is no talent');
                    }
                    console.log('RESULTS FORM BE', response);
                    var source = $('#candidates-template').html()
                    var template = Handlebars.compile(source);
                    var context = response.array;
                    var userType = response.userType;
                    if(userType === 'admin'){
                        $('.client-menus').remove();
                    }
                    var populatedHTML = template(context);
                    $('#candidates-container').html(populatedHTML);
                    DOCUMENTVIEWER.init();
                    CANDIDATES.interviewRequest();                    
                }
            });
        },
        search: function() {
            $('.search').on('click', function() {

                var queryObj = {
                    jobTitle: $('select[name=jobTitle]').val(),
                    company: $('select[name=company]').val(),
                    jobCategory: $('select[name=jobCategory]').val(),
                    location: $('select[name=location]').val(),
                    salary: $('select[name=salary]').val(),
                    contractType: $('select[name=contractType]').val()
                };
                var query = $.param(queryObj);
                CANDIDATES.fetch(query);
            });
        },
        reset: function(){
             $('.reset').on('click', function() {
                CANDIDATES.fetch();
            });
        },
        interviewRequest: function(){
          console.log('oi oi being abit sniffy');
          $('.interviewRequest').on('click', function(){
            console.log('butoooooon');
            let cvid = $(this).data('cvid');
            $('#' + cvid).toggleClass('hide-element');
            $('.ui.message.info').removeClass('.ui.info');
            $('#' + cvid).modal('show');

          });
        }
    };
    CANDIDATES.init();

})();
