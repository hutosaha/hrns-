var $ = window.$;

(function() {

    $('input[type=file]').on('change', function(event){
        $('input[type=submit]').prop('disabled', true);
        var files = event.target.files;
        var file = files[0];

        var filesize = ((file.size/1024)/1024).toFixed(4); // MB to 4dp
        if (filesize <= 10) {
          var file_url= event.target.nextElementSibling;
          var preview =$(this).parent().parent().parent().find('img');
          if (file == null) {
            alert("No file selected.");
          } else {
            get_signed_request(file, file_url, preview );
          }
        } else {
          alert("File size exceeds 10MB limit.");
        }

    });
})();

// creates a request to make assign a signature.
function get_signed_request(file, file_url, preview) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+ file.name + "&file_type=" + file.type);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('xhr.status', xhr.status);
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                upload_file(file, file_url, preview, response.signed_request, response.url);
            } else {
                alert("Error. Try uploading the file again");
            }
        }
    };
    xhr.send();
}

function upload_file(file, file_url, preview, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read-write');
    xhr.onload = function() {
        if (xhr.status === 200) {
          file_url.value = url; // where cvid is being saved & submitted with form
            $('input[type=submit]').prop('disabled', false); // to ensure cvid is supplied in payload
            if(preview) {
                preview.attr('src',url);
            }
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file. Please try again");
    };
    xhr.send(file);
}
