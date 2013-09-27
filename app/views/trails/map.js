function(doc) {
	if(doc._id.substr(0,6) === "trail:") {
		emit(doc._id.substr(6), {
			"trailName": doc.trailName,
			"trailDate": doc.trailDate,
			"trailLocation": doc.trailLocation,
			"trailDistance": doc.trailDistance,
			"trailNotes": doc.trailNotes,
			"rev": doc._rev
		});
	}
};
