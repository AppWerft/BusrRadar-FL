exports.create = function() {
	var self = Ti.UI.createView({
		backgroundColor : '#000',
		opacity : 0
	});
	var gaugeM = require('/modul/gauge');
	var tacho = new gaugeM;
	self.gauge = tacho.getView();
	self.add(self.gauge);
	self.add(Ti.UI.createImageView({
		image : '/images/strasse.png',
		bottom : 0
	}));
	var stopdisplays = [];
	Ti.App.addEventListener('app:shownextstops', function(_e) {
		if (_e) {console.log(_e);
			var stops = _e.stops;
			for (var i = 0; i < 7; i++) {
				stopdisplays[i].setText((stops && stops[i] && stops[i].name ) ? stops[i].name : '');
			}
		} else
			for (var i = 0; i < 7; i++)
				stopdisplays[i].setText('');

	});
	for (var i = 0; i < 7; i++) {
		var h = 45 - (i * 3);
		stopdisplays[i] = Ti.UI.createLabel({
			bottom : 1.2 * h * i,
			text : '',
			width : Ti.UI.FILL,
			height : h,
			left : 5 + i * 15,
			color : 'white',
			opacity : 1 - i * 0.1,
			font : {
				fontSize : h * 0.7 - (2 * i),
				fontWeight : 'bold'
			}
		});
		self.add(stopdisplays[i])
	}
	Ti.App.addEventListener('app:showmonitor', function(_e) {
		if (_e.visible) {
			self.animate({
				opacity : 1,
				duration : 800
			});

		} else {
			self.animate({
				opacity : 0,
				duration : 800
			});
		}
	});
	return self;
}