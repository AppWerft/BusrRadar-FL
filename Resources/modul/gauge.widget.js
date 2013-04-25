function Gauge() {
	return this.init();
}
Gauge.prototype.init = function() {
	var self = this;
	Ti.App.addEventListener('app:updateTacho', function(_e) {
		if (_e.data && _e.data.speed) {
			self.rotateArrow(_e.data.speed / 1.8);
		}
	});
	this.view = Ti.UI.createView({
		width : 320,
		height : 235,
		top : 0
	});
	var ratiobackground = Ti.UI.createImageView({
		image : '/images/gauge.png'
	});
	this.view.add(ratiobackground);
	this.arrow = Ti.UI.createImageView({
		width : Ti.App.SCREENWIDTH * 0.66,
		image : '/images/needle.png',
		center : {
			x : 160,
			y : 162
		},
	});
	this.view.add(this.arrow);
	return this;
}

Gauge.prototype.rotateArrow = function(_angle) {
	if (_angle && isNaN(_angle))
		return;
	// Parameter oder gespeicherte Variante, falls Parameter leer
	var myangle = _angle;
	if (myangle > 100) {
		myangle = 100;
	}
	myangle = myangle * 180 / 100;
	this.arrow.animate({
		transform : Ti.UI.create2DMatrix().rotate(myangle),
		duration : 6000
	});
};

Gauge.prototype.getView = function() {
	return this.view;
};
module.exports = Gauge;
