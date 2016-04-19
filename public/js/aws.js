(function() {
    document.getElementById('file_input').onchange = function() {
        var files = document.getElementById("file_input").files;
        var file = files[0];
        if (file == null) {
            alert("No file selected.");
        } else {
            get_signed_request(file);
        }
    };
})();

// creates a request to make asign a signature.
function get_signed_request(file) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/sign_s3?file_name="+ file.name + "&file_type=" + file.type);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            console.log('xhr.status', xhr.status);
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                upload_file(file, response.signed_request, response.url);
            } else {
                alert("Error. Try uploading the file again");
            }
        }
    };
    xhr.send();
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read-write');
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById('file_url').value = url;
            if(document.getElementById('preview')) { 
                document.getElementById('preview').src =url; // where cvid is being saved & submitted with form
            }
        }
    };
    xhr.onerror = function() {
        alert("Could not upload file. Please try again");
    };
    xhr.send(file);
}
