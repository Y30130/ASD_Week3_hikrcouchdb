
$('#addNewHike').on('pageinit', function() {
		var myForm = $('#hikeForm');
			myForm.validate({
				invalidHandler: function(form, validator) {
					},
				submitHandler: function(form) {
				var data = myForm.serializeArray();
				saveData(this.key);//data
				}
		
			});
	//save data function
	var saveData = function(data, key) {
		// if there is no key, this mean there is a new title, and a new key is necessary

        if (!key) {
            var id = Math.floor(Math.random() * 10000001);
        } else {
            // set id to existing key we're editing so it will save over key
            // the key is same that's been passed along from the editSubmit event handler
            // to the validate function, and then passed here into the storekey function.
            id = key;
        }

		
		//get form information and store within an object
		var hike = {};
			hike.trailName = [$("#trailName").val()];
			hike.trailDate = [$("#trailDate").val()];
			hike.trailLocation = [$("#trailLocation").val()];
			hike.trailDistance = [$("#trailDistance").val()];
			hike.trailNotes = [$("#trailNotes").val()];
			hike.key = [$("#key").val()];
			
			//convert object to string
			localStorage.setItem(id, JSON.stringify(hike));
			
			//notify the user, equipment has been added
			if(localStorage.length === 0){
				alert("Trail not stored.");
			} else {
				alert("Trail added to localStorage!")

			}
		window.location.reload();
	};

});

$('#displayHikes').on('pageinit', function(){
	$('#json').on('click', function(){
		$('#myHikeListingsJSON').empty();
		$.ajax({
			url		 : 'xhr/data.json',
			type	 : 'GET',
			dataType : 'json',
			success  : function(jsondata) {
				for(var i=0, j=jsondata.hike.length; i<j; i++) {
					var hike = jsondata.hike[i];
					$('#myHikeListingsJSON').append(
						$('<li>').append(
							$('<a>').attr("href", "#")
								.text(hike.trailName)
						)
					);
					$('#myHikeListingsJSON').listview().listview('refresh');
				}
			}
		});
		
	});
	$('#couchDb').on('click', function(){
		$('#couchList').empty();
		$.ajax({
			"url": "_view/trails",
			"dataType": "json",
			"success": function(data) {
				$.each(data.rows, function (index, trail) {
					var trailName = trail.value.trailName;
					var trailLocation = trail.value.trailLocation;
					var trailDistance = trail.value.trailDistance;
					$('#couchList').append(
						$('<li>').append(
							$('<a>').attr("href", "#")
								.text(trailName)
						)
					);
				});
				$('#couchList').listview().listview('refresh');
			}
		});
	});
	$('#xml').on('click', function(){
		$('#myHikeListingsXML').empty();
		$.ajax({
			url		 : 'xhr/data.xml',
			type 	 : 'GET',
			dataType : 'xml',
			success	 : function(xml) {
				$(xml).find('item').each(function() {
					var trailName = $(this).find('trailName').text();
					var trailNotes = $(this).find('trailNotes').text();
					var trailDate = $(this).find('trailDate').text();
					var trailLocation = $(this).find('trailLocation').text();
					var trailDistance = $(this).find('trailDistance').text();
					$('#myHikeListingsXML').append(
						$('<li>').append(
							$('<a>').attr("href", "#")
								.text(trailName)
						)
					);
				});
				$('#myHikeListingsXML').listview().listview('refresh');
			}

		});
	});
});	

$('#displayHikes').on('pageinit', function(){
	$('#lstorage').on('click', function(){
		//Clears the field before it repoplulates it with new data
		//this will prevent duplicates
		$('#localStorageListings').empty();
		//for loop to continue through localStorage for all items.
		for( var i=0, ls = localStorage.length; i < ls; i++) {
		var key = localStorage.key(i);
		var value = localStorage.getItem(key);
		
		var objectString = JSON.parse(value);
		//console.log(objectString);

			var subList = $(''+
				'<div class="lstorageListing">' +
					'<h3>' + objectString.trailName +'</h3>' +
					'<span>' + '<strong>Trail Date:</strong> ' + objectString.trailDate +'</span><hr />' +
					'<span>' + '<strong>Trail Location:</strong> ' + objectString.trailLocation +'</span><hr />' +
					'<span>' + '<strong>Trail Distance:</strong> ' + objectString.trailDistance +'</span><hr />' +
					'<span>' + '<strong>Trail Notes:</strong> ' + objectString.trailNotes +'</span><hr />' +
					'<div class="ui-block-b">' + '<input type="button" class="delete" value="Delete" id="' + key + '"/>' + '</div>'+
					// '<div class="ui-block-b">' + '<input type="button" class="edit" value="Edit" id="' + key + '"/>' + '</div>'+
					'<br />'+
				'</div>'
				
			).appendTo('#localStorageListings');
			
			
			//edit function
			/* $('.edit').on('click', function(){
			var value = localStorage.getItem(this.key);
				$.mobile.changePage('#addItem');
				var eKey = $(this).attr('#id');
				$('#trailName').val(objectString.trailName[0]);
				$('#trailDate').val(objectString.trailDate[0]);
				$('#trailLocation').val(objectString.trailLocation[0]);
				$('#trailDistance').val(objectString.trailDistance[0]);
            	$('#trailNotes').val(objectString.trailNotes[0]);
				$('#key').val(objectString.value[0]);
			});*/
			
			// Could Not Get Edit Function to Work Properly :(

			//delete function
			$('.delete').on('click', function(){
				var answer = ('Are you sure you want to delete this item?');
				if (answer){
					var dKey = this.id;
					localStorage.removeItem(dKey);
					window.location.reload();
				}

				
			});

		}
	})
});

//This will clear the localstorage
$("#clearLocalStorage").on('click', function() {
	if(localStorage.length === 0){
		alert("There is nothing to delete");
	}else {
    	var verify = confirm("Are you sure you want to clear the localStorage?");
	}
    if (verify) {
        localStorage.clear()
        alert("Local storage has been cleared.");
    }
    ;
});