function(doc) {
	if(doc._id.substr(0,6) === "trail:") {
		emit(doc._id.substr(8), {
			"trailName": doc.trailName,
			"trailDate": doc.trailDate,
			"trailLocation": doc.trailLocation,
			"trailDistance": doc.trailDistance,
			"trailNotes": doc.trailNotes
		});
	}
};