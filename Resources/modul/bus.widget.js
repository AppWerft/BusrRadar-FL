exports.set = function(map, busmarkers, busroutes, bus) {
	var busmarker = busmarkers[bus.vehicleId];
	var title = Ti.App.Model.getTitle(bus.ZielShort);
	if (!busmarker) {
		Ti.App.Model.getImage(bus, function(image) {
			busmarker = Ti.Map.createAnnotation({
				latitude : bus.lat,
				longitude : bus.lon,
				image : image,
				subtitle : '   ', //bus.friendlyName,
				leftButton : '/images/' + bus.line + '.jpg',
				rightButton : '/images/tacho.png',
				title : title,
				busdata : bus
			});

			map.addAnnotation(busmarker);
			busmarkers[bus.vehicleId] = busmarker;
		});
	} else {
		console.log(title + ' ' + bus.line);
		Ti.App.Model.getImage(bus, function(image) {
			busmarker.busdata = bus;
			busmarker.leftButton = '/images/' + bus.line + '.jpg';
			busmarker.setLatitude(bus.lat);
			busmarker.setImage(image);
			busmarker.title = title;
			busmarker.setLongitude(bus.lon);
			map.fireEvent('repaint');
		});

	}
	var busroute = busroutes[bus.vehicleId];
	if (!busroute) {
		busroute = [{
			latitude : bus.lat,
			longitude : bus.lon
		}];
	} else {
		busroute.push({
			latitude : bus.lat,
			longitude : bus.lon
		});
	}
}
