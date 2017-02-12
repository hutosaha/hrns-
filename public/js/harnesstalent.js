
var $ = window.$;

(function() {

    var CANDIDATES = {
        init: function() {
            this.fetch();
            this.search();
            this.reset();
            this.interviewRequest();
            this.dropdown();
        },
        queryObject: {
                    jobTitle: $('select[name=jobTitle]').val(),
                    company: $('select[name=company]').val(),
                   // jobCategory: $('select[name=jobCategory]').val(),
                    location: $('select[name=location]').val(),
                    salaryMin: $('select[name=salaryMin]').val(),
                    salaryMax: $('select[name=salaryMax]').val(),
                    contractType: $('select[name=contractType]').val()
                },
        fetch: function(query) {
            $.ajax({
                url: '/harnesstalent/results',
                data: query,
                success: function(response) {
                    if(response.array === false){
                        $('.ui.message').text('There is no talent');
                    }

                    var filteredCandidates   = response.array;
                    var companies = response.companies;
                    var userType  = response.userType;
                    if(userType === 'admin'){
                        $('.client-menus').remove();
                    }

                    var HTtemplate      = Handlebars.templates.candidatesTemplate(filteredCandidates);
                    var CompaniesTemplate  = Handlebars.templates.companies(companies);

                    $('#candidates-container').html(HTtemplate);
                    $('#companies-container').html(CompaniesTemplate);
                    DOCUMENTVIEWER.init();
                    CANDIDATES.interviewRequest();
                }
            });
        },
        search: function() {
            var self =this;
            $('.search').on('click', function() {

                var queryObj = {
                    jobTitle: $('select[name=jobTitle]').val(),
                    company: $('select[name=company]').val(),
                   // jobCategory: $('select[name=jobCategory]').val(),
                    location: $('select[name=location]').val(),
                    salaryMin: $('select[name=salaryMin]').val(),
                    salaryMax: $('select[name=salaryMax]').val(),
                    contractType: $('select[name=contractType]').val()
                }
                var query = $.param(queryObj);
                CANDIDATES.fetch(query);
            });
        },
        reset: function(){
             var self = this;
             $('.reset').on('click', function() {
                for(var key in self.queryObject){
                    $('select[name='+key+']').val('All');
                }
                CANDIDATES.fetch();
            });
        },
        interviewRequest: function(){
            var self =this;
            $('.interviewRequest').on('click', function(){
                $('.message').text('');
                var cvid = $(this).data('cvid');
                $('#' + cvid).toggleClass('hide-element');
                $('.ui.message.info').removeClass('.ui.info');
                $('#' + cvid).modal('show');
                $( ".datepicker" ).datepicker({dateFormat: 'DD, d MM, yy'});
                AWS.init();
                self.sendInterviewRequest();
            });
        },
        sendInterviewRequest: function(){
                var self = this;

                $('.button.send-interview').off().on('click', function(e) {
                    e.preventDefault();
                    var cvid = $(this).data('cvid');
                    var form =  document.forms[cvid];
                    var firstTime = form['firstIntTime'].value;
                    var firstDate = form['firstIntDate'].value;
                    var interviewAddress = form['interviewAddress'].value;
                    //var stage = form['stage'].value;
                    var fields = [firstDate, firstTime, interviewAddress];
                    var validated =  self.validate(fields);

                    if ( validated[0] === '' || validated[0] === null ){
                        return  $('.message').addClass('ui info').text('We need the date, time, stage and location of the interview');
                    } else {
                        var formData = $('form[name='+cvid+']').each(function(){ $(this).find(':input');});
                        return  self.sendFormData(formData ,cvid);
                    }
                });
        },
        validate: function(fields){
            var self = this;
            return  fields.filter(self.checkForEmpty);
        },
        checkForEmpty: function(field){
             return field ==''|| field == null;
        },
        sendFormData: function(formData, cvid){
            var data = formData.serialize();
            //console.log('DATA', data);
                $.ajax({
                    type: 'POST',
                    url: '/harnesstalent/interview/proposed',
                    data: data,
                    async: true,
                    success: function(cvid) {
                        if (cvid) {
                            $('.message').addClass('ui info message').text("We\'ve emailed the agent to arrange an interview"); // change to something better...
                            $('#' + cvid).modal('hide');
                            $('button[data-cvid='+cvid+'].interviewRequest').text('Interview Requested').addClass('orange');
                            $('form[name='+cvid+']').find("input, textarea").val("");
                        } else {
                            $('#' + cvid).modal('hide');
                            $('.message').innerHTML = 'Sorry, there was an error. Please try again!';
                        }
                    },
                    error: function(res) {
                        console.log("ERROR", res);
                        $('#' + cvid).modal('hide');
                        $('.message').innerHTML = 'Sorry, there was an error. Please try again!';
                    }
            });
        },
        datepicker: function(){
             $( ".datepicker" ).datepicker({dateFormat: 'DD, d MM, yy'});
        },
        dropdown: function(){
            $(".ui.fluid.dropdown").dropdown({ allowLabels:true});
            $('.ui.fluid.dropdown').dropdown({'set selected': 'All'});
        }
    };
    CANDIDATES.init();

})();
