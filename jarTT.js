/* First we unload any existing jarTT instances */
var wasLoaded = false;
var oldSettings = {};
if (typeof jarTT != "undefined" && jarTT != null) {
	wasLoaded = true;
	oldSettings = jQuery.extend(true, {}, jarTT.settings);
	jarTT.unload();
	jarTT = null;
}
//javascript:(function(){$.getScript('http://chrisinajar.com/jarTT.js');})();
/* Initialize the jarTT system and create all the elements/functions needed */
var jarTT = {
	log: function(){},
	findProp: {
		original: CSS3Helpers.findProperty,
		optimized: function(a,b){
			if(b=="transform" && (typeof $(a).attr('id') == "undefined"))
				return;
			return jarTT.findProp.original(a,b);
		}
	},
	settingsButton: {},
	roomDiv: {},
	hideAudience: function(toggle) {
		jarTT.roomDiv.children().each(function(i,obj) {
			obj = $(obj);
			if (toggle == (obj.css('display') == 'none'))
				return;
			if (obj.css('top') == '30px' || !obj.is("div") || (typeof obj.attr('class') != "undefined") || (typeof obj.attr('id') != "undefined"))
				return;
			if (obj.css('display') != 'none')
				obj.data('jarTT_wasShown', true);
			else if (typeof obj.data('jarTT_wasHidden') == "undefined")
				obj.data('jarTT_wasShown', false);
			
			if (toggle)
				obj.hide();
			else
				obj.show();
		});
	},
	settings: {
		'loaded': false,
		'hideAudience': false,
		'fixAnimations': false,
		'autoBop': true,
		'smiffTime': false,
		'lastSmiffTime': false
	},
	// not used, but maybe!
	showHelpMessage: function() {
		var box = $("<div />", {
			'class': "modal",
			'id': 'jarTT_HelpBox',
			'css': {
				'marginTop': '100px'
			}
		}).append($("<div />", {
			'class': "close-x"
		}).click(function() {
			box.remove();
			$("#overlay").hide();
		}));
		box.append("<h1>Welcome to jarTT</h1>");
		box.appendTo($("#overlay"));
		$("#overlay").show();
	},
	showSettings: function() {
		var box = $("<div />", {
			'class': "modal",
			'id': 'jarTT_Settings',
			'css': {
				'marginTop': '100px'
			}
		}).append($("<div />", {
				'class': "close-x"
			}).click(function() {
				box.remove();
				$("#overlay").hide();
			})
		);
		box.append("<h1>jarTT Settings</h1>");
		box.append("<br />Speed up Animations: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.fixAnimations
			}).click(function() {
				jarTT.settings.fixAnimations = this.checked;
				if (this.checked) {
					CSS3Helpers.findProperty = jarTT.findProp.optimized;
				} else {
					CSS3Helpers.findProperty = jarTT.findProp.original;
				}
			})
		);
		box.append("<br />Hide Audience: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.hideAudience
			}).click(function() {
				jarTT.settings.hideAudience = this.checked;
			})
		);
		box.append("<br />AutoBop: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.autoBop
			}).click(function() {
				jarTT.settings.autoBop = this.checked;
			})
		);
		box.append("<br /><br />SMIFF IT BITCH: ");
		box.append($("<input />", {
				'type': 'checkbox',
				'checked': jarTT.settings.smiffTime
			}).click(function() {
				jarTT.settings.smiffTime = this.checked;
			})
		);
		box.append("<br />");
		box.append("<br />");
		box.append($("<button />", {
				'text': 'Unload jarTT'
			}).button().click(jarTT.unload)
		);
		box.append("<br /><br /><br /><p>This mod is optimized and based entirely on the suggestions of the <a href=\"http://codingsoundtrack.com\">Coding Soundtrack</a> family.</p>");
		box.append("<p><span style=\"font-size: 8px;\"><i>(who are a bunch of creepy gingers and should not be trusted).<i></span></p>");
		box.appendTo($("#overlay"));
		$("#overlay").show();
	},
	timerId: {},
	tickFunction: function(jarTT) {
		if (!jarTT.settings.loaded)
			return;
		jarTT.hideAudience(jarTT.settings.hideAudience);
		
		var useSmiff = jarTT.settings.smiffTime || /will ?smi(th|ff)/i.test(turntable.JWoOYVpCBoX.currentSong.metadata.artist + turntable.JWoOYVpCBoX.currentSong.metadata.song);
		if (useSmiff || jarTT.settings.lastSmiffTime) {
			jarTT.settings.lastSmiffTime = useSmiff;
			jarTT.roomDiv.children().each(function(i,obj) {
				obj = $(obj);
				if (obj.css('display') == 'none' || obj.css('top') != '30px')
					return;
				var par = $(obj.children()[0]);
				obj.find("img").each(function(i,obj) {
					obj = $(obj);
					if (obj.css('display') == 'none')
						return;
					if (obj.attr('src').substr('-13') != "headfront.png")
						return;
					if (typeof obj.data('originalImage') == "undefined") {
						obj.data('originalImage', obj.attr('src'));
						par.data('originalTop', par.css('top'));
						par.data('originalMargin', par.css('marginTop'));
					}
					if (useSmiff) {
						obj.attr('src', 'http://chrisinajar.com/headfront.png');
						par.css({
							'top': '-20px'
						});
						// jitters
						if (Math.random()>0.85)
							par.css({'marginTop': ((Math.random()*4)-2) + 'px'});
						
					} else {
						obj.attr('src', obj.data('originalImage'));
						par.css({
							'top': par.data('originalTop'),
							'marginTop': par.data('originalMargin')
						});
					}
				});
			});
				
		}
	},
	openSeatStartTime: 0,
	onNewSong: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.settings.autoBop) {
			setTimeout(function() {
				jarTT.callback("upvote");
			},(Math.random() * 10000)+5000);
		}
	},
	onDjRemove: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if ($(".avatar_laptop").length == 4) {
			jarTT.openSeatStartTime = new Date();
		}
	},
	onDjAdd: function(data) {
		if (!jarTT.settings.loaded)
			return;
		if (jarTT.openSeatStartTime != 0 && $(".avatar_laptop").length == 5) {
			var now = new Date();
			var before = jarTT.openSeatStartTime;
			jarTT.openSeatStartTime = 0;
			jarTT.log("Slot was open for: " + (now - before));
			$("<div />", {
				html: "<center>Slot was open for<br />" + (now - before) + "ms</center>",
				id: "jarTT_slotTimer",
				class: "ui-corner-all",
				css: {
					backgroundColor: "white",
					border: "1px solid black",
					position: "absolute",
					zIndex: "1001",
					fontSize: "10px",
					top: "78px",
					left: "388px",
					display: "none",
					padding: "5px"
				}
			}).fadeIn().delay(10000).fadeOut(1000, function(){$(this).remove();}).appendTo(jarTT.roomDiv);
		}
	},
	eventMap: {},
	socketEvent: function(event) {
		var data = JSON.parse(event);
		if (!data.command || typeof data.command == "undefined")
			return;
		if (data.command in jarTT.eventMap) {
			if (jarTT.eventMap[data.command] instanceof Array) {
				for (var i = 0; i < jarTT.eventMap[data.command].length; ++i) {
					jarTT.eventMap[data.command][i](data);
				}
			} else {
				jarTT.eventMap[data.command](data);
			}
		} else {
			jarTT.log("Unkown message type (" + data.command + ")");
			jarTT.log(data);
		}
	},
	// girllookatthatbody
	identifyDiv: function(div) {
		div=$(div);
		
		// We want to fill this object with all of the information we find on this object...
		// it's functions are at the bottom of this.
		var dj = {
			body: {}
		};
		div.find("img").each(function(i,obj) {
			obj=$(obj);
			var img = obj.attr('src');
			var bodyPart = img.substr(1+img.lastIndexOf("/"));
			bodyPart = bodyPart.substr(0,bodyPart.length-4);
			dj.body[bodyPart] = obj;
		});
		
		// important..
		var matches = (new RegExp(",'([a-z0-9]+)'\\)\"><b>(.*)</b><br>([0-9,]+) DJ points<br>([0-9,]+) fans", "i")).exec(div.data("tipsy").getTitle());
		dj.userId = matches[1];
		dj.userName = matches[2];
		dj.points = matches[3];
		dj.fans = matches[4];

		// functions!
		dj.getUserInfo = function(callback) {
			jarTT.getUserInfo(dj.userId, callback);
		}

		// I work out...
		return dj;
	},
	userCache: {},
	getUserInfo: function(id, c) {
		if (typeof jarTT.userCache[id] == "undefined")
			jarTT.userCache[id] = {'lastUpdate':0};
		if (((new Date()) - jarTT.userCache[id].lastUpdate) < 10000) {
			c(jarTT.userCache[id].data);
			return true;
		}
		turntable.UeSGBsHSPp({
			api: "user.info",
			userid: id
		}, function(data) {
			jarTT.userCache[id].data = data;
			jarTT.userCache[id].lastUpdate = new Date();
			c(data);
		});

		return false;
	},
	load: function() {
		if (window.console && console.log)
			jarTT.log = function(msg){console.log(msg);};
		else
			jarTT.log = function(msg){};
		
		jarTT.settingsButton = $("<div />", {
			'class': "menuItem",
			'text': "jarTT Settings"
		});
		jarTT.settingsButton.click(jarTT.showSettings);
		jarTT.roomDiv = $($(".roomView > div")[1]);
		$("#menuh > div:last").before(jarTT.settingsButton);
		
		for (i in window) if (window[i] && window[i].callback) {
			jarTT.callback = window[i].callback;
			break;
		}

		jarTT.eventMap = {
			"newsong": [jarTT.onNewSong],
			"add_dj": [jarTT.onDjAdd],
			"rem_dj": jarTT.onDjRemove
		};
		
		turntable.socket.on("message", jarTT.socketEvent);

		if (!wasLoaded) {
			// We want to show the help message since this isn't a reload
			jarTT.showSettings();
		} else {
			// preserve settings
			jarTT.log(oldSettings);
			jarTT.settings = oldSettings;
		}

		if (jarTT.settings.fixAnimations)
			CSS3Helpers.findProperty = jarTT.findProp.optimized;

		jarTT.settings.loaded = true;
		
		jarTT.timerId = setInterval(function(){jarTT.tickFunction(jarTT)}, 100);
		jarTT.log("jarTT successfully loaded!");
	},
	unload: function() {
		// Kill the ticker right away
		clearTimeout(jarTT.timerId);
		
		// turn off our settings and re-run the ticker
		jarTT.settings.smiffTime = false;
		jarTT.tickFunction(jarTT);
		// disable loaded in case of accidental premature eventulation
		jarTT.settings.loaded = false;

		// unregister the event handler from whatever "socket" is
		turntable.socket.removeEvent("message", jarTT.socketEvent);
		
		// clean up our ui shit
		jarTT.settingsButton.remove();
		$("#jarTT_Settings").remove();
		$("#jarTT_HelpBox").remove();
		$("#overlay").hide();
		$("#jarTT_slotTimer").remove();
		// reenable the normal turntabl CSS3Helpers thing
		CSS3Helpers.findProperty = jarTT.findProp.original;
		// Show the audience. this can take a second...
		jarTT.hideAudience(false);
		
		jarTT.log("jarTT successfully unloaded!");
		jarTT = null;
	}
};
jarTT.load();