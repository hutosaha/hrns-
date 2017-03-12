(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['candidatesTemplate'] = template({"1":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "    <div class=\"ui stackable grid listView client-list\">\n        <div class=\"column\">\n            <button class=\"tiny ui inverted teal icon button doc-viewer\" data-agency-email=\""
    + alias4(((helper = (helper = helpers.agencyEmail || (depth0 != null ? depth0.agencyEmail : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"agencyEmail","hash":{},"data":data}) : helper)))
    + "\" data-agency-id=\""
    + alias4(((helper = (helper = helpers.agencyId || (depth0 != null ? depth0.agencyId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"agencyId","hash":{},"data":data}) : helper)))
    + "\" data-cvid=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\" data-candidate-name=\""
    + alias4(((helper = (helper = helpers.candidateName || (depth0 != null ? depth0.candidateName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"candidateName","hash":{},"data":data}) : helper)))
    + "\" data-job-title=\""
    + alias4(((helper = (helper = helpers.jobTitle || (depth0 != null ? depth0.jobTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"jobTitle","hash":{},"data":data}) : helper)))
    + "\" data-vid=\""
    + alias4(((helper = (helper = helpers.vid || (depth0 != null ? depth0.vid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"vid","hash":{},"data":data}) : helper)))
    + "\" data-file-name=\""
    + alias4(((helper = (helper = helpers["file-name"] || (depth0 != null ? depth0["file-name"] : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file-name","hash":{},"data":data}) : helper)))
    + "\"\n                data-content=\"We can only preview pdf files\" data-url='"
    + alias4(((helper = (helper = helpers.file_url || (depth0 != null ? depth0.file_url : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"file_url","hash":{},"data":data}) : helper)))
    + "'>CV Viewer</button>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.candidateName || (depth0 != null ? depth0.candidateName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"candidateName","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.jobTitle || (depth0 != null ? depth0.jobTitle : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"jobTitle","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.company || (depth0 != null ? depth0.company : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"company","hash":{},"data":data}) : helper)))
/*    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.jobCategory || (depth0 != null ? depth0.jobCategory : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"jobCategory","hash":{},"data":data}) : helper)))
*/    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.location || (depth0 != null ? depth0.location : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"location","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.salary || (depth0 != null ? depth0.salary : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"salary","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n        <div class=\"two wide column\">\n            <p>"
    + alias4(((helper = (helper = helpers.contractType || (depth0 != null ? depth0.contractType : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"contractType","hash":{},"data":data}) : helper)))
    + "</p>\n        </div>\n        <div class=\"column client-button\">\n            <button class=\"ui inverted tiny blue button interviewRequest \" data-cvid=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\">Request Interview</button>\n        </div>\n    </div>\n    <div class=\"ui divider\"></div>\n    <div class=\"ui  modal interview hide-element\" id=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\">\n\n        <i class=\"close icon\"></i>\n        <div class=\"header\">\n            Arrange an Interview for: &nbsp "
    + alias4(((helper = (helper = helpers.candidateName || (depth0 != null ? depth0.candidateName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"candidateName","hash":{},"data":data}) : helper)))
    + "\n        </div>\n        <div class=\"ui content\">\n            <div class=\" sixteen column row  \">\n            <form class=\"ui form \" name=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\">\n                    <input type=\"hidden\" name=\"candidateName\" value=\""
    + alias4(((helper = (helper = helpers.candidateName || (depth0 != null ? depth0.candidateName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"candidateName","hash":{},"data":data}) : helper)))
    + "\">\n                    <input type=\"hidden\" name=\"cvid\" value=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\">\n                    <input type=\"hidden\" name=\"vid\" value=\""
    + alias4(((helper = (helper = helpers.vid || (depth0 != null ? depth0.vid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"vid","hash":{},"data":data}) : helper)))
    + "\">\n                    <input type=\"hidden\" name=\"agencyId\" value=\""
    + alias4(((helper = (helper = helpers.agencyId || (depth0 != null ? depth0.agencyId : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"agencyId","hash":{},"data":data}) : helper)))
    + "\">\n                    <h4 class=\"ui dividing header\"> Proposed time, date and location</h4>\n                    <h4 class=\"message\"></h4>\n\n                    <div class=\"inline fields\">\n                        <div class=\"required sixteen wide field\">\n                            <label for=\"firstIntTime\"> 1st Choice Date & Time </label>\n                            <div class=\"five wide field\">\n                                <input name=\"firstIntDate\" class=\"datepicker\" required>\n                            </div>\n                            <div class=\"field\">\n                                <input name=\"firstIntTime\" type=\"time\" required></input>\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"inline fields\">\n\n                        <label for=\"secondIntTime\"> 2nd Choice Date & Time </label>\n                        <div class=\"five wide field\">\n                            <input name=\"secondIntDate\" class=\"datepicker\">\n                        </div>\n                        <div class=\"field\">\n                            <input name=\"secondIntTime\" type=\"time\"></input>\n                        </div>\n                    </div>\n\n                    <div class=\"inline fields\">\n                        <label for=\"thirdIntTime\"> 3rd Choice Date & Time</label>\n                        <div class=\"five wide field\">\n                            <input name=\"thirdIntDate\" class=\"datepicker\">\n                        </div>\n                        <div class=\" field \">\n                            <input name=\"thirdIntTime\" type=\"time\"></input>\n                        </div>\n                    </div>\n\n                    <div class=\"inline fields\">\n                         <div class=\"required ten wide field\">\n                            <label for=\"jobTitle\"> Job Title</label>\n                            <div class=\"five wide field\">\n                                <input name=\"jobTitle\" type=\"text\">\n                            </div>\n                               <label for=\"jobLocation\"> Job Location</label>\n                            <div class=\"five wide field\">\n                                <input name=\"jobLocation\" type=\"text\">\n                            </div>\n                        </div>\n                    </div>\n\n                    <div class=\"inline fields\">\n                        <label for=\"salary\"> Salary /Day Rate (£)</label>\n                        <div class=\" five wide field  \">\n                            <input name=\"salary\" type=\"number\"></input>\n                        </div>\n                        <label for=\"contractType\"> Contract Type</label>\n                        <div class=\" five wide field  \">\n                           <select name=\"contractType\" class=\"ui dropdown\">\n                                <option value=\"permanent\">Permanent</option>\n                                <option value=\"contract\">Contract</option>\n                                <option value=\"both\">Both</option>\n                            </select>\n                        </div>\n                    </div>\n\n                    <div class=\"inline fields\">\n                            <div class=\"required twelve wide field\">\n                                <label>Full Interview Address:</label>\n                                <div class=\"required twelve wide field\">\n                                    <input type=\"text\" id=\"interviewAddress\" name=\"interviewAddress\" placeholder=\"Buckingham Palace, London SW1A 1AA \" required></input>\n                                </div>\n                            </div>\n\n                    </div>\n\n                    <div class=\" sixteen column row\">\n                        <div class=\"inline field\">\n                          <label>Upload job description.</label>\n                            <div class=\"field\">\n                              <input name=\"jobDescription\" type=\"file\" class=\"file_input\" />\n                              <input type=\"hidden\" class=\"file_url\" name=\"jobDescription_url\" />\n                            </div>\n                        </div>\n                    </div>\n                    <br>\n                    <br>\n                    <div class=\"inline field\">\n                      <label>Aditional comments</label>\n                          <div class=\"eight wide field\">\n                            <textarea name=\"additionalComments\" value=\"\" width=\"500px\" rows=\"3\" maxlength=\"2000\" placeholder=\"e.g. bring portfolio, interview will be one hour, etc.\" pattern=\""
    + alias4(((helper = (helper = helpers.frontendInput || (depth0 != null ? depth0.frontendInput : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"frontendInput","hash":{},"data":data}) : helper)))
    + "\"></textarea>\n                          </div>\n                    </div>\n\n\n                  <div class=\"actions\">\n                    <input type=\"submit\" class=\"ui green large button send-interview\" data-candidate-name=\""
    + alias4(((helper = (helper = helpers.candidateName || (depth0 != null ? depth0.candidateName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"candidateName","hash":{},"data":data}) : helper)))
    + "\"  data-cvid=\""
    + alias4(((helper = (helper = helpers.cvid || (depth0 != null ? depth0.cvid : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cvid","hash":{},"data":data}) : helper)))
    + "\">\n                  </div>\n            </form>\n        </div>\n      </div>\n    </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"useData":true});

templates['companies'] = template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "           <option value=\""
    + alias2(alias1(depth0, depth0))
    + "\">"
    + alias2(alias1(depth0, depth0))
    + "</option>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "  <label for=\"company\" class=\"company\"> Company </label>\n        <select name=\"company\" class=\"ui dropdown companycss\">\n            <option value=\"All\">All</option>\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},depth0,{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </select>   \n";
},"useData":true});
})();