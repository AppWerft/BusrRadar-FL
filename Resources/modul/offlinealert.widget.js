function Alert() {
	return this.init();
}

Alert.prototype.init = function() {
	this.view = Ti.UI.createLabel({
		width : Ti.UI.FILL,
		height : 20,
		text : 'BusRadar besorgt die Positionsdaten …',
		backgroundColor : '#111',
		color : 'white',
		font : {
			fontSize : 12
		},
		top : 0
	});
	var self = this;
	Ti.App.addEventListener('app:online', function(_e) {
		var top = (_e.state === true) ? -20 : 0;
		self.view.setBackgroundColor('#900');
		self.view.setText('Der BusdRarar braucht eine Internverbindung …');
		self.view.animate({
			top : top,
			duration : 900
		})
	});
	return this.view;
};
module.exports = Alert;
