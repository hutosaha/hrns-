(function() {
    document.getElementById('cv').onchange = function() {
        var files = document.getElementById("cv").files;
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
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                console.log('RESPONSE', response.cvid);
                upload_file(file, response.signed_request, response.url);

            } else {
                alert("Could not get signed URL.");
            }
        }
    };
    xhr.send();
}

function upload_file(file, signed_request, url){
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", signed_request);
    xhr.setRequestHeader('x-amz-acl', 'public-read');
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('URL', url);
            document.getElementById('file_url').value = url;

        }
    };
    xhr.onerror = function() {
        alert("Could not upload file.");
    };
    xhr.send(file);
}