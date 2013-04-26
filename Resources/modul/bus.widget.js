exports.set = function(map, busmarkers, busroutes, bus) {
	var busmarker = busmarkers[bus.vehicleId];
	if (!busmarker) {
		Ti.App.Model.getImage(bus, function(image) {
			busmarker = Ti.Map.createAnnotation({
				latitude : bus.lat,
				longitude : bus.lon,
				image : image,
				subtitle : bus.friendlyName,
				leftButton : '/images/' + bus.line + '.jpg',
				rightButton : '/images/tacho.png',
				title : Ti.App.Model.getTitle(bus.ZielShort),
				busdata : bus
			});

			map.addAnnotation(busmarker);
			busmarkers[bus.vehicleId] = busmarker;
		});
	} else {
		busmarker.busdata = bus;
		busmarker.setLatitude(bus.lat);
		busmarker.setLongitude(bus.lon);
		map.fireEvent('repaint');
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
