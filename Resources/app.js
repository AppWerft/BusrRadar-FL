(function() {
	var Model = require('modul/model.busse').Model;
	Ti.App.Model = new Model();
	require('ui.main').create();
})();
