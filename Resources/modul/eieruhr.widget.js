exports.create = function() {
	var self = Ti.UI.createView({
		bottom : 0,
		width : 180,
		height : 100,
		right :-20,
		bubbleParent : false
	});
	var display = Ti.UI.createView({
		height : 70,
		bottom : -70
	});
	self.add(display);
	display.add(Ti.UI.createView({
		backgroundColor : 'black',
		opacity : 0.5
	}));
	var clock = Ti.UI.createLabel({
		text : '60:00',
		color : 'yellow',
		font : {
			fontFamily : 'DS-Digital-Bold',
			fontSize : 58
		}
	});

	display.add(clock);
	var startButton = Ti.UI.createImageView({
		width : 100,
		image : '/images/start.png',
	});
	startButton.addEventListener('click', function() {
		var timer = new Date();
		Ti.App.Properties.setInt('startclock', Math.ceil(timer.getTime() / 1000));
		display.animate({
			bottom : 0,
			duration : 1540
		});
		this.animate({
			bottom : -110,
			duration : 700
		});
		setInterval(function() {
			var timer = new Date();
			if (Ti.App.Properties.hasProperty('startclock')) {
				var rest = 3599 - (Math.floor(timer.getTime() / 1000) - Ti.App.Properties.getInt('startclock'));
				if (rest < 0) {
					Ti.App.Properties.removeProperty('startclock');
					display.bottom = -120;
				}
				var min = Math.floor(rest / 60);
				var sec = (rest - min * 60) % 60;
				if (sec < 10)
					sec = '0' + sec;
				console.log(sec);
				clock.setText(min + ':' + sec);
			}
		}, 5000);
	});
	self.add(startButton);
	return self;
}