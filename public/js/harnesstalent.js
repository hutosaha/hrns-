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
        sendInterviewRequest: function(){
                var self = $.this
                
                $('.button.send-interview').on('click', function(e) {
                    e.preventDefault();
                    const cvid = $(this).data('cvid');
                    let form =  document.forms[cvid];
                    let firstTime = form['firstIntTime'].value;
                    let firstDate = form['firstIntDate'].value;
                    let interviewAddress = form['interviewAddress'].value;
                    let stage = form['stage'].value;
                    let fields = [firstDate, firstTime, interviewAddress, stage];
    
                    let validated =  validate(fields);
        
                    if ( validated[0] === '' || validated[0] === null ){
                        return  $('.message').addClass('ui info').text('We need the date, time, stage and location of the interview'); 
                    } else {
                        let formData = $('form[name='+cvid+']').each(function(){ $(this).find(':input');});
                        return  sendFormData(formData ,cvid);
                    }   
                });
        },
        validate: function(fields){
            return  fields.filter(checkForEmpty);
        },
        checkForEmpty: function(field){
             return field ==''|| field == null;
        },
        sendFormData: function(formData, cvid){
            var data = formData.serialize();
                $.ajax({
                    type: 'POST',
                    url: '/interview/proposed',
                    data: data,
                    async: true,
                    success: function(cvid) {
                        if (cvid) {
                            $('#message').addClass('ui info message').text("We\'ve emailed the agent to arrange an interview"); // change to something better...
                            $('#' + cvid).modal('hide');
                            $('form[name='+cvid+']').find("input, textarea").val("");
                        } else {
                            $('#' + cvid).modal('hide');
                            document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                        }
                    },
                    error: function(res) {
                        console.log("ERROR", res);
                        $('#' + cvid).modal('hide');
                        document.getElementById('message').innerHTML = 'Sorry, there was an error. Please try again!';
                    }
            });
        }
    };
    CANDIDATES.init();

})();
