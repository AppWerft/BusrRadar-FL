exports.create = function() {
	// Map stuff
	var mapwindow = Ti.UI.createWindow({
		title : 'Busradar Flensburg'
	});
	mapwindow.map = require('modul/map.widget').create();
	mapwindow.add(mapwindow.map);
	var masterwindow = Ti.UI.createWindow({
	});
	var clouds = require('modul/clouds').create();
	var monitor = require('modul/monitor').create();
	///  Main frame:
	if (Ti.Platform.osname === 'ipad') {
		masterwindow.add(clouds);
		masterwindow.add(monitor);
		clouds.moveCloud();
		var splitwindow = Ti.UI.iPad.createSplitWindow({
			detailView : mapwindow,
			masterView : masterwindow,
			hide : true
		});
		splitwindow.open();
		Ti.App.addEventListener('app:showmaster', function() {
			splitwindow.setVisible(true);
		});
		splitwindow.addEventListener('visible', function(e) {
			if (e.view == 'detail') {
				//	e.button.title = "Archiv-Liste";
				//	detailWindow.leftNavButton = e.button;
			} else if (e.view == 'master') {
				//	detailWindow.leftNavButton = null;
			}
		});
	} else {
		masterwindow.addEventListener('click', function() {
			masterwindow.remove(clouds);
			masterwindow.remove(monitor);
			masterwindow.close({
				transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
			});
		})
		Ti.App.addEventListener('app:showmonitor', function(_e) {
			masterwindow.add(clouds);
			masterwindow.remove(monitor);
			clouds.moveCloud();
			masterwindow.open({
				transition : Ti.UI.iPhone.AnimationStyle.CURL_UP
			});
		});
		mapwindow.open();
	}
}
