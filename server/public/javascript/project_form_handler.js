/**
 * ADAPTED FROM: "JavaScript: serialize a form as JSON"
 * ORIGINAL AUTHOR: Gabriele Romanato
 * SOURCE: https://codepen.io/gabrieleromanato/pen/LpLVeQ
 */

(function myFunction() {

	function toJSON( form ) {
		var obj = {};
		var elements = form.querySelectorAll( "input, select, textarea" );
		for( var i = 0; i < elements.length; ++i ) {
			var element = elements[i];
			var name = element.name;
			var value = element.value;

			if( name ) {
				obj[ name ] = value;
			}
		}
		return obj;
	}

	document.addEventListener( "DOMContentLoaded", function() {
		var form = document.getElementById( "editprj" );
		var output = document.getElementById( "output" );
		form.addEventListener( "submit", function( e ) {
			e.preventDefault();
            var json = toJSON( this );
            // SOURCE: https://stackoverflow.com/questions/6944744/javascript-get-portion-of-url-path
            var urlPath = document.location.pathname.split('/');
            var prjId = urlPath[2];
            var data = {
                "name": json.projectName,
                "blurb": json.projectBlurb,
                "projectId": prjId
            }
			//output.innerHTML = JSON.stringify(data);
            var XHR = new XMLHttpRequest();
            XHR.open('PUT', document.URL);
            XHR.setRequestHeader('Content-Type', 'application/json');
            XHR.send(JSON.stringify(data));
		}, false);

    });
    
    document.addEventListener( "DOMContentLoaded", function() {
        var form = document.getElementById( "upload" );
		form.addEventListener( "submit", function( e ) {
            e.preventDefault();
            var XHR = new XMLHttpRequest();
            XHR.open('POST', document.URL + '/files');
            XHR.send();
		}, false);        
    });

})();