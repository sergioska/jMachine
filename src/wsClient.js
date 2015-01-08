var socket = io.connect( 'http://localhost:8888' );
/*
$( "#testPosts" ).click( function(){
	post = $("#txtPost").val();
    $.ajax({
    	url: "./ajax/insertNewMessage.php",
        type: "POST",
        async: false,
        data: "message="+post,
        success: function(data) {
			console.log(data);
            socket.emit( 'messageforposts', function() {
            	console.log("message for posts emitted!");
            });
        }
    });
});
*/
socket.on( 'firstmsg', function( data ){
	console.log(data);
});


socket.on( 'data', function( data ) {
    console.log(data);
});

socket.on('matrix', function(output){
        console.log(output.matrix);
});