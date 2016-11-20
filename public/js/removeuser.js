 var $ = window.$;
(function() {
 
    $('.ui.search').search({ 
        apiSettings: {
            url: '/user/remove/results',      
        },
        fields: {
            results: 'items',
            title: 'contactName'
        },
        onSelect:function(result, response){
     
            $('[name=contactName]').html(result.contactName);
            $('[name=email]').html(result.email);
            $('[name=contactNumber]').html(result.contactNumber);
            $('[name=companyName]').html( result.companyName);    
            $('[name=type]').html(result.type);
            $('[name=id]').html(result.id);
            var removeButton = '<button class="ui inverted red button remove" type="button">remove</button>';
            $('.buttonDiv').html(removeButton);

            $(".red.button.remove").click(function(){
                    $.post(
                            "/user/remove/delete", 
                            { id:result.id, type: result.id}, 
                            function(data, status){
                                alert("Data: " + data + "\nStatus: " + status);
                            }
                    )
            });
        }
    });
})();