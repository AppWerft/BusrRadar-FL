exports.create = function() {
	var self = Ti.UI.createView({
		backgroundColor : '#000',
	});
	var titlelabel = Ti.UI.createLabel({
		zIndex : 99,
		top : 0,
		left : 10,
		color : 'yellow',
		height : 60,
		textAlign : 'left',
		font : {
			fontFamily : 'Belfast',
			fontSize : 42
		}
	});
	self.add(titlelabel);
	var gaugeM = require('/modul/gauge.widget');
	var tacho = new gaugeM;
	self.gauge = tacho.getView();
	self.gauge.setTop(40);
	self.add(self.gauge);
	self.add(Ti.UI.createImageView({
		image : '/images/strasse.png',
		bottom : 0
	}));
	var stopdisplays = [];
	Ti.App.addEventListener('app:hidenextstops', function(_e) {
		for (var i = 0; i < 7; i++)
			stopdisplays[i].setText('');
	});
	Ti.App.addEventListener('app:shownextstops', function(_e) {
		if (_e) {
			var stops = _e.stops;
			for (var i = 0; i < 7; i++) {
				stopdisplays[i].setText((stops && stops[i] && stops[i].name ) ? stops[i].name : '');
			}
		} else
			for (var i = 0; i < 7; i++)
				stopdisplays[i].setText('');

	});
	for (var i = 0; i < 7; i++) {
		var h = 45 - (i * 3.1);
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
				fontWeight : 'bold',
				fontFamily : 'DINBold'
			}
		});
		self.add(stopdisplays[i])
	}
	Ti.App.addEventListener('app:showmonitor', function(_e) {
		titlelabel.setText(_e.line + '  ' + _e.endstop)
	});
	return self;
}