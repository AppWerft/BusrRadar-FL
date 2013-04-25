var stopsdata = [], currentrouteid = undefined;

exports.getProxies = function(_data) {
	var stops = require('modul/stops').stops;
	var routes = require('modul/routes').routes;
	var route = undefined;
	if (!currentrouteid || currentrouteid != _data.line.nr + _data.line.ziel) {
		console.log('NewRoute=============');
		for (var i = 0; i < routes.length; i++) {
			if (routes[i].ziel == _data.line.ziel && routes[i].nr == _data.line.nr) {
				route = routes[i].poly;
				break;
			}
		}
		if (!route) {
			currentrouteid = undefined;
			return;
		}
		for (var p = 0; p < route.length; p++) {
			var stopid = route[p];
			for (var s = 0; s < stops.length; s++) {
				if (stops[s].id == stopid) {
					stops[s].dist = require('modul/geo').getDist(_data.position.lat, _data.position.lon, stops[s].lat, stops[s].lon);
					stops[s].olddist = undefined;
					stops[s].passed = false;
					stopsdata.push(stops[s]);
				}
			}
		}
		currentrouteid = _data.line.nr + _data.line.ziel;
		Ti.Media.vibrate();
	}
	var listofnextstations = [];
	for (var i = 0; i < stopsdata.length; i++) {
		var stop = stopsdata[i];
		stop.dist = require('modul/geo').getDist(_data.position.lat, _data.position.lon, stop.lat, stop.lon);
		if (i < stopsdata.length - 1) {
			// Calculation of current segment:
			var bear1 = require('modul/geo').getBear(_data.position.lat, _data.position.lon, stop.lat, stop.lon);
			var bear2 = require('modul/geo').getBear(_data.position.lat, _data.position.lon, stopsdata[i + 1].lat, stopsdata[i + 1].lon);
			var beardiff = (Math.abs(bear1 - bear2) + 720) % 360;
			stop.passed = (beardiff > 90 && beardiff < 270) ? true : false;
			if (beardiff > 90 && beardiff < 270) {
				console.log(stopsdata[i + 1].name);
				break;
			}
		}
	}
	for (var i = stopsdata.length - 1; i > 0; i--) {
		var stop = stopsdata[i];
		if (!stop.passed) {
			listofnextstations.unshift({
				name : stop.name,
				dist : (stop.dist / 1000).toFixed(1)
			});

		} else
			break;
	}
	Ti.App.fireEvent('app:shownextstops', {
		stops : listofnextstations
	});

	//console.log(stopsdata);
}
