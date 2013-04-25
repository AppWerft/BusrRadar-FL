exports.create = function() {
	var self = Ti.Map.createView({
		mapType : Ti.Map.STANDARD_TYPE,
		region : {
			latitude : 54.801965,
			longitude : 9.424734,
			latitudeDelta : 0.04,
			longitudeDelta : 0.04
		},
		animate : true,
		regionFit : true,
		userLocation : true,
	});
	var alertM = require('modul/offlinealert.widget');
	var busmarkers = {};
	var busroutes = {};

	Ti.App.addEventListener('app:newposition', function(_e) {
		var busse = _e.positions;
		for (var i = 0; i < busse.length; i++) {
			require('modul/map.bus').set(self, busmarkers, busroutes, busse[i]);
		}
	});
	var busstopmarker = [];

	Ti.App.Model.getStops(function(stops) {
		for (var i = 0; i < stops.length; i++) {
			var stop = stops[i];
			busstopmarker[i] = Ti.Map.createAnnotation({
				latitude : stop.lat,
				longitude : stop.lon,
				image : '/images/stopsign.png',
				title : i,
				subtitle : stop.name
			});
		}
	});
	self.addEventListener('regionchanged', function(_e) {
		if (_e.latitudeDelta < 0.035)
			self.addAnnotations(busstopmarker)
		else {
			for (var i = 0; i < busstopmarker.length; i++)
				self.removeAnnotation(busstopmarker[i]);
		}
	});
	self.addEventListener('click', function(_e) {
		self.add(new alertM);
		if (_e.clicksource == 'pin' && _e.annotation.layer && _e.annotation.busdata) {
			Ti.App.fireEvent('app:shownextstops');
			Ti.App.Model.setCurrentX(_e.annotation.busdata);

		} else {
			Ti.App.Model.setCurrentX(null);
		}
	});
	Ti.App.addEventListener('resume', function() {
		for (var i = 0; i < busmarkers.length; i++)
			self.removeAnnotation(busmarkers[i]);
	});
	self.add(require('modul/eieruhr.widget').create());

	self.add(new alertM);
	return self;
}
