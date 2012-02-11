jarTT.events = {
	eventMap: {},
	registerEvent: function(type, func) {
		if (!(type in jarTT.events.eventMap))
			jarTT.events.eventMap[type] = [];
		jarTT.events.eventMap[type].push(func);
	},
	socketEvent: function(event) {
		var data = JSON.parse(event);
		if (!data.command || typeof data.command == "undefined")
			return;
		jarTT.events.dispatchEvent(data.command, data);
	},
	dispatchEvent: function(eventName, data) {
		if (eventName in jarTT.events.eventMap) {
			if (jarTT.events.eventMap[eventName] instanceof Array) {
				for (var i = 0; i < jarTT.events.eventMap[eventName].length; ++i) {
					jarTT.events.eventMap[eventName][i](data);
				}
			} else {
				jarTT.events.eventMap[eventName](data);
			}
		} else {
			jarTT.log("Unkown event type (" + eventName + ")");
			jarTT.log(data);
		}
	},
	load: function() {
			jarTT.events.registerEvent("newsong", jarTT.events.onNewSong);
			jarTT.events.registerEvent("speak", jarTT.events.onSpeak);
			jarTT.events.registerEvent("jarTT_loaded", jarTT.events.onFinishLoad);
			jarTT.events.registerEvent("jarTT_unloaded", jarTT.events.unload);
	},
	unload: function() {
		turntable.socket.removeEvent("message", jarTT.events.socketEvent);
	},
	onFinishLoad: function(data) {
		if (jarTT.settings.fixAnimations)
			CSS3Helpers.findProperty = jarTT.findProp.optimized;

		turntable.socket.on("message", jarTT.events.socketEvent);
		jarTT.settings.loaded = true;

		jarTT.timerId = setInterval(function(){jarTT.tickFunction(jarTT)}, 100);

		jarTT.log("jarTT successfully loaded!");
	},
	onNewSong: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.settings.autoBop) {
			setTimeout(function() {
				jarTT.callback("upvote");
			},(Math.random() * 10000)+5000);
		}
	},
	onSpeak: function(data) {
		id = data.userid;

		jarTT.getUserInfo(id, function(user) {
			user.lastMessage = new Date();
		});
	}
}
