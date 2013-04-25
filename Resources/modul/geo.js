exports.getDist = function(lat1, lon1, lat2, lon2) {
	if (!lat1 || !lat2 || !lon1 || !lon2)
		return 0;
	var R = 6371000;
	var dLat = (lat2 - lat1) * Math.PI / 180;
	var dLon = (lon2 - lon1) * Math.PI / 180;
	var lat1 = lat1 * Math.PI / 180;
	var lat2 = lat2 * Math.PI / 180;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c;
	return d;
}
exports.getBear = function(lat1, lon1, lat2, lon2) {
	try {
		if (!lat1 || !lat2 || !lon1 || !lon2)
			return 0;
		var dLat = (lat2 - lat1) * Math.PI / 180;
		var dLon = (lon2 - lon1) * Math.PI / 180;
		var y = Math.sin(dLon) * Math.cos(lat2);
		var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
		return Math.atan2(y, x) * 180 / Math.PI;
	} catch(E) {
		console.log(E)
	}
}
