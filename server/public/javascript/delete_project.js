(function myFunction() {
  
	document.addEventListener( "DOMContentLoaded", function() {
        var form = document.getElementById( "deletePrj" );
		form.addEventListener( "submit", function( e ) {
            e.preventDefault();
            // REFERENCE: https://stackoverflow.com/questions/9139075/how-to-show-a-confirm-message-before-delete
            var result = confirm("Are you sure you want to delete this project?");
            if (result) {
                //Logic to delete the item
                var prjId = $('#prjId').prop('value'); 
                var prjUrl = document.URL + '/' + prjId;
                var XHR = new XMLHttpRequest();
                XHR.open('DELETE', prjUrl);
                XHR.setRequestHeader('Content-Type', 'application/json');
                XHR.onload = function () {
                    if (XHR.readyState === XHR.DONE) {
                        if(XHR.status === 204) {
                            window.alert("Success!");
                            location.reload();
                        }
                        else {
                            window.alert("There was a problem deleting your project!");
                            location.reload();
                        }          
                        XHR.send(null);                         
                    }
                }    
                //For debug only:
                //document.getElementById("test").innerHTML = "DELETE " + document.URL + '/' + prjId; 
                XHR.send(null);
            }                
        }, false);
        
    });
})();