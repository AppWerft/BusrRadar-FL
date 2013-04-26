if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if ( typeof this !== "function") {
			throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1), fToBind = this, fNOP = function() {
		}, fBound = function() {
			return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
		};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}

function Model() {
	if (!(this instanceof Model)) {
		return new Model();
	}
	return this.construct();
}

Model.prototype.construct = function() {
	Ti.App.Properties.removeProperty('currentX');
	this.lastpositions = {};
	this.currentX = {};
	this.getVehiclePos();
	this.cron = setInterval(this.getVehiclePos.bind(this), 5000)
};

Model.prototype.setCurrentX = function(_currentX) {
	Ti.App.fireEvent('app:showmonitor', {
		visible : (_currentX) ? true : false
	});
	Ti.App.Properties.removeProperty('currentX');
	if (_currentX) {
		Ti.App.Properties.setString('currentX', JSON.stringify(_currentX));
	}
	this.currentX = _currentX;
}

Model.prototype.getCurrentX = function() {
	try {
		var currentx = Ti.App.Properties.hasProperty('currentX') ? JSON.parse(Ti.App.Properties.getString('currentX')) : null;
	} catch (E) {
		Ti.App.Properties.removeProperty('currentX');
		return null
	}
	return currentx;
}

Model.prototype.calcPositionsandSpeeds = function(_currentpositions) {
	var Geo = require('modul/geo'), diff = 0;
	for (var i = 0; i < _currentpositions.length; i++) {
		var current = _currentpositions[i];
		var lastposition = this.lastpositions[current.vehicleId];
		var speed = 0;
		if (!lastposition)
			lastposition = {};
		diff = current.LastModified - lastposition.LastModified;
		diff = 5.0;
		if (lastposition && lastposition.lat && lastposition.lon && diff) {
			var dist = Geo.getDist(current.lat, current.lon, lastposition.lat, lastposition.lon);
			speed = dist / diff;
		}
		this.lastpositions[current.vehicleId] = {
			lat : current.lat,
			lon : current.lon,
			line : current.line,
			speed : (speed * 3.6).toFixed(1),
			dist : dist,
			diff : diff,
			LastModified : current.LastModified
		};
	}
	//console.log(this.lastpositions);
};

Model.prototype.getTitle = function(foo) {
	var titles = {
		'LABA' : 'Am Lachsbach',
		'KRDK' : 'Kruså/DK',
		'ZOB' : 'Zentraler Omnibusbahnhof',
		'BHF' : 'Bahnhof',
		'MHWE' : 'Marienhölzungsweg',
		'FRÖW' : 'Frösleeweg',
		'CAUN' : 'Campusmensa/Uni',
		'HEST' : 'Hesttoft',
		'SÜND' : 'Sünderup',
		'TRUP' : 'Tremmerup',
		'SOLI' : 'Solitüde'
	};
	return titles[foo];
}

Model.prototype.getVehiclePos = function() {
	var self = this;
	var id = (this.getCurrentX()) ? this.getCurrentX().vehicleId : null;
	var xhr = Ti.Network.createHTTPClient({
		onerror : function() {
			Ti.App.fireEvent('app:online', {
				state : false
			})
		},
		onload : function() {
			try {
				Ti.App.fireEvent('app:online', {
					state : true
				});
				var positions = JSON.parse(xhr.responseText).result;
				self.calcPositionsandSpeeds(positions);
				Ti.App.fireEvent('app:newposition', {
					positions : positions
				});
				if (id) {// Bus is active
					Ti.App.fireEvent('app:updateTacho', {
						data : self.lastpositions[id]
					});
					var nextstops = require('modul/model.line').getProxies({
						position : {
							lat : self.lastpositions[id].lat,
							lon : self.lastpositions[id].lon
						},
						line : {
							nr : self.getCurrentX().line,
							ziel : self.getCurrentX().ZielShort
						},
						id : id
					});
					Ti.App.fireEvent('app:shownextstops', {
						stops : nextstops
					});
				}
			} catch (E) {
			}
		}
	});
	xhr.open('GET', 'http://www.busradar-flensburg.de/json/busradar/vehiclepos');
	xhr.send(null);
}
Model.prototype.getStops = function(_callback) {
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory + 'allstops.json');
	var self = Ti.Network.createHTTPClient({
		onload : function() {
			var stops = JSON.parse(this.responseText).result;
			for (var i = 0; i < stops.length; i++) {
				stops[i].id = i;
				stops[i].lines = [];
			}
			file.write(JSON.stringify(stops));
			_callback(stops)
		}
	});
	self.open('GET', 'http://www.busradar-flensburg.de/json/stops/all');
	self.send(null);
};

Model.prototype.getImage = function(bus, imagecallback) {
	var url = 'http://www.busradar-flensburg.de/img/icon/mappin/br/' + bus.line + '/' + encodeURI(bus.ZielShort) + '/12/pin.png';
	var file = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory, Ti.Utils.md5HexDigest(url) + '.png');
	if (file.exists()) {
		imagecallback(file.nativePath);
		return;
	}
	var self = Ti.Network.createHTTPClient({
		onload : function() {
			file.write(this.responseData);
			file.remoteBackup = false;
			imagecallback(file.nativePath)
		},
		onerror : function() {
			console.log(this.error)
		}
	});
	self.open('GET', url);
	self.send(null);
};

exports.Model = Model;
