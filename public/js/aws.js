var $ = window.$;

(function() {

    var files, file, file_url, preview;

    $('input[type=file]').on('change', function(event){
        files = event.target.files;
        file = files[0];
        file_url= event.target.nextElementSibling;
        preview =$(this).parent().parent().parent().find('img');
    });

    $('input[type=submit]').on('click', function(event) {
      event.preventDefault();
      check_file_extension(file, (response) => {
        response === "accept" ?
        get_signed_request(file, file_url, preview) :
        alert('Please make sure that your file is in one of the following formats: .docx, .doc, .odt, .pdf');
      });
    });

})();

function check_file_extension(file, callback) {
  var acceptedFiles = ["doc", "docx", "odt", "pdf"];
  var file_extension = file.name.substr(file.name.lastIndexOf('.')+1);
  acceptedFiles.indexOf(file_extension) > -1 ? callback("accept") : callback("decline");
}


// creates a request to make assign a signature.
function get_signed_request(file, file_url, preview) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+ file.name + "&file_type=" + file.type);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
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
