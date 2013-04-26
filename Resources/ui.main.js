exports.create = function() {
	// Map stuff
	var mapwindow = Ti.UI.createWindow({
		title : 'Busradar Flensburg'
	});
	mapwindow.map = require('modul/map.widget').create();
	mapwindow.add(mapwindow.map);
	var masterwindow = Ti.UI.createWindow({
	});
	var clouds = require('modul/clouds.widget').create();
	var monitor = require('modul/monitor.widget').create();
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
		Ti.App.addEventListener('app:hidemonitor', function(_e) {
			masterwindow.remove(monitor);
			clouds.moveCloud();
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
		//	masterwindow.remove(monitor);
			masterwindow.close({
				transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
			});
		})
		Ti.App.addEventListener('app:showmonitor', function(_e) {
			//	masterwindow.add(clouds);
			masterwindow.add(monitor);
			clouds.moveCloud();
			masterwindow.open({
				transition : Ti.UI.iPhone.AnimationStyle.CURL_UP
			});
		});
		Ti.App.addEventListener('app:hidemonitor', function(_e) {
			//	masterwindow.add(clouds);
			masterwindow.close({
				transition : Ti.UI.iPhone.AnimationStyle.CURL_DOWN
			});
			setTimeout(function() {
				masterwindow.remove(monitor);
			}, 2000);

		});
		mapwindow.open();
	}
}
