(function myFunction() { 
    document.addEventListener( "DOMContentLoaded", function() {
        var form = document.getElementById( "upload" );
        form.addEventListener( "submit", function( e ) {
            e.preventDefault();
            var urlPathSplit = document.location.pathname.split('/');
            var urlBase = urlPathSplit[0];
            var urlPath = urlPathSplit[1];            
            var prjId = $('#prjId').prop('value'); 
            var prjUrl =  urlBase + '/' + urlPath + '/' + prjId;
            var widget = window.cloudinary.openUploadWidget({
                cloudName: 'foliospace', 
                uploadPreset: 'foliospace',
                folder: prjId
            },             
            (error, result) => {
                if (result && result.event === "success") {   
                    //output.innerHTML = JSON.stringify(result);  
                    // send the public_id of the image(s) to the database
                    var XHR = new XMLHttpRequest();
                    XHR.open('POST', prjUrl + '/files');
                    XHR.setRequestHeader('Content-Type', 'application/json');
                    XHR.send(JSON.stringify(result));                    
                } else {
                    console.log(error);
                }
            });  
        }, false);        
    });
})();