exports.fetch = function(_imageview) {
	function fetchImage() {
		var self = Ti.Network.createHTTPClient({
			timeout : 30000,
			onload : function() {
				_imageview.setImage(self.responseData);
				fetchImage();
			},
			onerror : function(_e) {
				console.log('error retrieving new image ' + _e.error)
			}
		});
		self.open('GET', _imageview.webcamurl);
		self.send(null);
	}Ti.App.Model.Test();return;
	fetchImage();
}
