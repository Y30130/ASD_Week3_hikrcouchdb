$('#displayHikes').live('pageshow', function() { // Couch Code for Display Hikes Page
	$.couch.db("hikrcouchdb").view("app/trails", { // Call CouchDB Methods using a view
		success:function(data) {
			// console.log(data);
			$('#couchList').empty();
			$.each(data.rows, function(index, value) {
				var item = (value.value || value.doc);
				$('#couchList').append( // pass data back to front end
					$('<li>').append(
						$('<a>')
							.attr("href", "trails.html?trail=" + item.trailName, getData())
							.text(item.trailName)
					)
				);
			});
			$('#couchList').listview().listview('refresh');
		}
	});
});

var urlVars = function() { // get the data back out of the couchDB
	var urlData = $($.mobile.activePage).data("url");
	var urlParts = urlData.split('?');
	var urlPairs = urlParts[1].split('&');
	var urlValues = {};
	for (var pair in urlPairs) {
		var keyValue = urlPairs[pair].split('=');
		var key = decodeURIComponent(keyValue[0]);
		var value = decodeURIComponent(keyValue[1]);
		urlValues[key] = value;
	}
	return urlValues;
}

$('#trail').live('pageshow', function() {
	var trail = urlVars()["trail"];
	// console.log(trail);
	
});


$('#addNewHike').on('pageinit', function() { // Code for Add New Hike Page
		delete $.validator.methods.date;
				var myForm = $('#hikeForm');
	myForm.validate({
		invalidHandler: function(form, validator) {
		},
		submitHandler: function() {
			var data = myForm.serializeArray();
			storeData(data);
		}
	});
	
	
});

$('#displayHikes').on('pageinit', function(){ // Content Aggregation Code (XML, JSON, etc)...
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


// Functions 
// STORE DATA FUNCTION, refactored for Hikr	couchDB
var storeData = function(data){
	var key = $('#submitHike').data('key');
	var rev = $('#submitHike').data('_rev');
	console.log(key);
	console.log(rev);
	var hike = {};

	if (rev) {		
		hike._id = key;
		hike._rev = rev;
	}
	hike._id = "trail:" + data[0].value; 
	hike.trailName = data[0].value.trailName;
	hike.trailDate = data[1].value.trailDate;
	hike.trailLocation = data[2].value.trailLocation;
	hike.trailDistance = data[3].value.trailDistance;
	hike.trailNotes = data[4].value.trailNotes;
	hike.rev = data[5].value.rev;

	console.log(hike);

	$.couch.db('hikrcouchdb').saveDoc(hike, {
		success: function(hike){
			alert('Trail Saved!');
			resetForm();
			$('#submitHike').attr('value', 'Add Trail').removeData('key').removeData('rev');
			$.mobile.changePage('#home');
		}
	});
};

var getData = function(){ // Get Data to Populate Form Fields
	
	var labels = ["Trail Name: ", "Date of Hike: ", "Trail Location: ", "Trail Location: ", "Notes/Comments: ", "Rev: "];
	
		var appendLocation = $('#trailItems');

	 $.couch.db('hikrcouchdb').view("app/trails", {
		success: function(data){
			// console.log(data);
			$('#trailItems').empty();
			$.each(data.rows, function(index, hike) {
				var makeEntry = $('<div>')
					.attr('data-role', 'collapsible')
					.attr('data-mini', 'true')
					.attr('id', hike.key)
					.appendTo(appendLocation)
				;

				var makeH3 = $('<h3>')
					.html(hike.value.trailName + ' - ' + hike.value.trailDate)
					.appendTo(makeEntry)
				;

				var makeDetailsList = $('<ul>').appendTo(makeEntry);
				var labelCounter = 0;
				for (var k in hike.value) {
					var makeLi = $('<li>')
						.html(labels[labelCounter] + hike.value[k])
						.appendTo(makeDetailsList)
					;
					labelCounter++;
				}
				
				var buttonHolder = $('<div>').attr('class', 'ui-grid-a').appendTo(makeEntry);
				var editButtonDiv = $('<div>').attr('class', 'ui-block-a').appendTo(buttonHolder);
				var removeButtonDiv = $('<div>').attr('class', 'ui-block-b').appendTo(buttonHolder);
				var editButton = $('<a>')
					.attr('data-role', 'button')
					.attr('href', '#addNewHike')
					.html('Edit')
					.data('key', hike.key)
					.data('rev', hike._rev)
					.appendTo(editButtonDiv)
					.on('click', editHike)	
				;
				var removeButton = $('<a>')
					.attr('data-role', 'button')
					.attr('href', '#')
					.html('Remove')
					.data('key', hike.key)
					.data('rev', hike._rev)
					.appendTo(removeButtonDiv)
					.on('click', removeHike)
				;
				// console.log(hike.key);
				console.log(hike.rev);
				$(makeEntry).trigger('create');
			});
			$(appendLocation).trigger('create');
		},
		reduce: false	
	});
};

var editHike = function (){
	var key = "trail:" + $(this).data('key');
	var rev = $(this).data('rev');
	// console.log(rev);
	// console.log(key);
	$.couch.db('hikrcouchdb').openDoc(key, {
		success: function(hike) {
			$('#_id').val(hike._id);
			$('#_rev').val(hike.rev);
			$('#trailName').val(hike.trailName);
			$('#trailDate').val(hike.trailDate);
			$('#trailLocation').val(hike.trailLocation);
			$('#trailDistance').val(hike.trailDistance);
			$('#trailNotes').val(hike.trailNotes);
			$('#submitHike').attr('value', 'Update Trail').data('key', key).data('rev', rev);
		}
	});
};



var	removeHike = function (){
	var ask = confirm("Are you sure you want to delete this trail?");
	if (ask) {
		var doc = {
				'_id': "trail:"+$(this).data('key'),
		};
		$.couch.db('hikrcouchdb').removeDoc(doc, {
			success: function(data){
				alert("Trail Removed!");
				console.log('');
				window.location.reload();
			}
		});
	} else {
		alert("Trail was not removed.");
	}		
};

var clearData = function(){
	if (localStorage.length === 0) {
			alert("There are no saved hikes to clear.");
		} else {
			localStorage.clear();
			alert("All saved hikes have been cleared.");
			window.location.reload();
			return false;
		}
};

function resetForm () {
	$( '#hikeForm' ).each(function(){
    this.reset();
});
};
