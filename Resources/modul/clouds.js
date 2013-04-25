exports.create = function() {
	Ti.include('/vendor/moment.js');
	var self = Ti.UI.createView({
		width : Ti.UI.FILL,
		height : Ti.UI.FILL,
		backgroundColor : 'white'
	});
	self.cloud = Ti.UI.createImageView({
		image : '/images/bg.jpg',
		left : 0,
		top : 0,
		height : 768,
		width : 2100
	});
	self.add(self.cloud);
	var fl = Ti.UI.createImageView({
		image : '/images/fl.png',
		width : 240,
		bottom : 0
	});
	self.add(fl);
	var clock = Ti.UI.createLabel({
		text : '',
		font : {
			fontSize : 22,
			fontFamily : 'DINBold'
		},
		color : '#333',
		height : Ti.UI.SIZE,
		textAlign : 'center',
		bottom : 150
	});
	fl.add(clock);
	self.moveCloud = function() {
		self.cloud.animate({
			left : -2100 + 320,
			duration : 160000,
			repeat : 1000,
			curve : Ti.UI.ANIMATION_CURVE_LINEAR
		});
	}
	self.addEventListener('focus', function() {
		console.log('FOCUS')
	})
	self.moveCloud();
	setInterval(function() {
		clock.setText(moment().format('HH:mm:ss') + ' Uhr');
	}, 1000);
	return self;
}
