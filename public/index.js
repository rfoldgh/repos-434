

var STATE = {pieces: []};



//https://rebrickable.com/api/<function> API call


// this function's name and argument can stay the
// same after we have a live API, but its internal
// implementation will change. Instead of using a
// timeout function that returns mock data, it will
// use jQuery's AJAX functionality to make a call
// to the server and then run the callbackFn
function getRecentLegoBuilds(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.


     var input = $('#input-field');



//      input.on('keydown', function(event) {
//     if (event.keyCode != 13) {
//         return;
//     }

//     $.get('https://rebrickable.com/api/get_part?key=KdPMcvXXIi&format=json&part_id='+input.val(), function(data){
//     console.log(data);
//   })


//      $.get('https://rebrickable.com/api/get_part_sets?key=KdPMcvXXIi&format=json&color_id=&setheader=0&part_id='+input.val(), function(data){
//     console.log(data);
//   })


// });



}

function getSetByPart(callbackFn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
    console.log(STATE.pieces);
    var total = 0;
    var sets = {};
    var matchSets = [];
    STATE.pieces.forEach(function(piece){

        var endpoint = 'https://rebrickable.com/api/get_part_sets?key=KdPMcvXXIi&format=json&part_id='+piece.part_id+'&color_id=&setheader=0';
      // console.log(endpoint);
           $.ajax({
             url:endpoint,
             type:"GET",
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
                 total++;
                 piece.sets = data[0].sets;
                // console.log(data);
                 findMatch(total);
                 console.log('find matches are type: ' + JSON.stringify(typeof matchSets));
                 console.log(matchSets);

                $('.favorites-section').html('');
                $('.favorites-section').show();


              for (var i =0;i<3;i++){
                    var template = showSet(matchSets[i]);
                 $('.favorites-section').append(template);

                }


             },error:function(err){
                 console.log(err);
                 total++;
                 findMatch(total);
             } //end success
        });

    });

     function findMatch(total){

            if (total == STATE.pieces.length){
                     STATE.pieces.forEach(function(piece){
                         if(!piece.sets){
                             return;
                         }
                         piece.sets.forEach(function(set_part){
                            if(set_part.set_id in sets){
                                sets[set_part.set_id]++;

                            } else{
                                    sets[set_part.set_id] = 1;
                            }

                            if(sets[set_part.set_id] == total){
                                matchSets.push(set_part);
                            }
                         });


                     });
                     callbackFn(matchSets);
                 }
     }


}

// this function stays the same when we connect
// to real API later
function displayLegoBuilds(data) {
    for (index in data.legoBuilds) {
	   //$('body').append(
    //     '<p>' + data.legoBuilds[index].text + '</p>');
    // }

    //  $('body').append(
    //      '<p>Here are my builds!<br><br>' + JSON.stringify(data.legoBuilds[index]) + '</p>');
     }
}

// this function can stay the same even when we
// are connecting to real API
function getAndDisplayLegoBuilds() {
	getRecentLegoBuilds(displayLegoBuilds);
}

//  on page load do this
$(function() {
	getAndDisplayLegoBuilds();
})

function showSet(piece) {

    // console.log(piece);

   var template = $('.template .set').clone();
       template = $(template);

    //  if(piece.set_id){
    //      template.find('.add-piece').hide();
    //  } else{
    //      template.find('.remove-piece').hide();
    //  }
        template.find('.set-title').text(piece.name);
        template.find('.num-parts').text("number of parts: " +piece.num_parts);
         template.find('.title-link').attr("href","https://rebrickable.com/sets/"+piece.set_id);

        // template.find('.piece-image').attr("src", piece.img_sm);
        // template.find('.image-link').attr("href", piece.img_sm);



	template.find('.remove-piece').click(function(){

	       $.ajax({
             url:'/pieces/'+piece.set_id,
             type:"DELETE",
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
              console.log(data);

             } //end success
        });

        template.find('.remove-piece').parent().parent().remove();



	});

        return template;
}


function showPiece(piece) {

    // console.log(piece);

   var template = $('.template .piece').clone();
       template = $(template);

     if(piece._id){
         template.find('.add-piece').hide();
     } else{
         template.find('.remove-piece').hide();
     }
        template.find('.piece-title').text(piece.name);
        template.find('.piece-description').text(piece.category);
        template.find('.piece-image').attr("src", piece.part_img_url);
        template.find('.image-link').attr("href", piece.part_img_url);



	template.find('.remove-piece').click(function(){

	       $.ajax({
             url:'/pieces/'+piece._id,
             type:"DELETE",
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
              console.log(data);

             } //end success
        });

        template.find('.remove-piece').parent().parent().remove();



	});

        return template;
}

function addFavorite(favorite){

      $.ajax({
             url:'/favorites',
             type:"POST",
             data: JSON.stringify({favoriteSet:favorite.favoriteSet}),
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
            console.log("Your favorite set is" + data);
              console.log('favorite has been added');
              console.log("Your favorite sets saved are:" + data);
             }
        });
}

function addPiece(piece){

    $.ajax({
             url:'/pieces',
             type:"POST",
             data: JSON.stringify({partId:piece.part_id, partName: piece.name, partURL: piece.part_url, partImage: piece.part_img_url,category:piece.category}),
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
              console.log('piece has been added');
             }
        });

}



$(document).ready(function(){



    jQuery('.welcome-page').click(function(){

     $('.login-create').hide();
     $('.builds').hide();
     $('.search-pieces').hide();
     jQuery('.jon-bio').hide();
     $('.favorites-section').hide();
     $('.welcome').show();


    });

    $('.login-create').hide();
     $('.builds').hide();
     $('.search-pieces').hide();
     jQuery('.jon-bio').hide();
     $('.favorites-section').hide();



    jQuery('.jon-bio-button').click(function(){

            $('.login-create').hide();
            $('.builds').hide();
            $('.search-pieces').hide();
            $('.favorites-section').hide();
            $('.welcome').hide();
            $('.jon-bio').show();


        });


    jQuery('.find-sets').click(function(){


        getSetByPart(function(match_sets){
           // console.log(match_sets);

        });

    });


    jQuery('.login-button').click(function(){
        // e.preventDefault();
        $('.login-create').show();
        $('.welcome').hide();
    });


	jQuery('.user-login').submit(function(e){
	    e.preventDefault();

	    var userName = $('#log-in-username').val();
	    var passWord = $('#log-in-password').val();

	    $.ajax({
             url:'/login',
             type:"POST",
             data: JSON.stringify({username: userName, password: passWord}),
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
               console.log('Success login: '+data);
               jQuery('.login-create').hide();
               $('.search-pieces').show();
                $('.builds').show();
                 jQuery('.creation-message').hide();
             }
        });
	});

	jQuery('.user-create').submit(function(e){
	    e.preventDefault();

	    var newUsername = $('#create-username').val();
	    var newPassword = $('#create-password').val();

	      $.ajax({
             url:'/users',
             type:"POST",
             data: JSON.stringify({username: newUsername, password: newPassword}),
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
               console.log('successful user registration: '+data);
                $('body').append('<div class="container"><div class="row"><p class="creation-message">User Account Created!</p></div></div>');
                $('#create-username').val('');
	             $('#create-password').val('');
	              jQuery('.login-create').hide();
               $('.search-pieces').show();
                $('.builds').show();
             }
        });
	});



	jQuery('.piece-input').submit(function(e){
	    e.preventDefault();
	    var partId = $('#piece-number').val();
	       $.ajax({
             url:'https://rebrickable.com/api/get_part?key=KdPMcvXXIi&format=json&part_id='+partId,
             type:"GET",
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
                //console.log(data);
                $('.favorites-section').hide();
                 $('.pieces').html('');

               var template = showPiece(data);

               $('.pieces').html(template);

               	jQuery('.add-piece').click(function(){
                    addPiece(data);

            	});

             }
        });
	});

	jQuery('.logout').click(function(){


	     $.ajax({
             url:'/logout',
             type:"GET",
             success: function(){
                $('.search-pieces').hide();
                $('.builds').hide();
                $('.welcome').show();
                $('.favorites-section').hide();

             } //end success
        });

	});

	jQuery('.get-favorites').click(function(e){
	    e.preventDefault();

	       $.ajax({
             url:'/pieces',
             type:"GET",
             contentType:"application/json; charset=utf-8",
             dataType:"json",
             success: function(data){
                console.log(data);
                STATE.pieces = data;
                 $('.favorites-section').html('');
                 $('.favorites-section').show();

                 $('.pieces').html('');

                data.forEach(function(item){

                    var template = showPiece(item);
                 $('.favorites-section').append(template);


                });


             } //end success
        });
	});


	jQuery('.add-favorite').click(function(){


	    var userFavorite = $('.favorites-section').html();
	    addFavorite(userFavorite);
	});

 $(".button-collapse").sideNav();

});//end document.ready

	   // jQuery.post('/login', {username: userName, password: passWord}, function(err,data){



	   // console.log(err);
	   // console.log(data);

	   //    //data: JSON.stringify({
    //     //   username: data.username,
    //     //   password: data.password
    //     // })

	   //	},"json");
