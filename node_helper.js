var NodeHelper = require("node_helper");
var validUrl = require("valid-url");
var https = require('https');
require('ssl-root-cas').inject();
var request = require('request');

module.exports = NodeHelper.create({
    start: function () {
        console.log("Starting module: " + this.name);
        this.bustimes = [];
        this.config = {}
        this.updateTimer = null;
    },
    socketNotificationReceived: function (notification, payload) {
        if (notification === "BKK-FUTAR_START_WORKER") {
            this.config = payload.config
            this.scheduleUpdate(this.config.initialLoadDelay);

            return;
        } else if (notification === "BKK_FUTAR_KILL_WORKER") {
            clearTimeout(this.updateTimer);

            return;
        }
    },
    scheduleUpdate: function (delay) {
        var nextLoad = this.config.updateInterval;
        if (typeof delay !== "undefined" && delay >= 0) {
            nextLoad = delay;
        }
        var self = this;
        clearTimeout(this.updateTimer);
        this.updateTimer = setTimeout(function () {
            self.callBKKFutar();
        }, nextLoad);
    },
    callBKKFutar: function () {
        var self = this;
        stopIds = this.config.stopNumber;
        var stopNumbers = "";
        for (var i = 0; i < stopIds.length; i++) {
            var temp = stopNumbers.concat("&stopId=", stopIds[i]);
            stopNumbers = temp;
        }
          var url = 'http://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop.json?key=apaiary-test&version=3&appVersion=apiary-1.0&includeReferences=true&stopId=BKK_F03340&stopId=BKK_F03420&stopId=BKK_F03308&onlyDepartures=false&limit=60&minutesBefore=2&minutesAfter=30';
      //  var url = 'http://private-anon-2cd7c43bb6-bkkfutar.apiary-proxy.comM/bkk-utvonaltervezo-api/ws/otp/api/where/arrivals-and-departures-for-stop.json?key=apaiary-test&version=3&appVersion=apiary-1.0&includeReferences=true&stopId=BKK_F03340&stopId=BKK_F03420&stopId=BKK_F03308&onlyDepartures=false&limit=60&minutesBefore=2&minutesAfter=30'
        request(url, function (error, response, body) {
            
            if (error != null || response.statusCode != 200 || response.statuscode === null) {
                self.sendSocketNotification("BKK_FUTAR_UNAVAILABLE");
            }
         self.processData(JSON.parse(body));
            
        });
    },
    processData: function (body) {
        console.log("process");
        var currentTime = body.currentTime;
        var currTime = new Date(currentTime);
        var depTime;
        var waitMin;
        var waitSec;
        var stopName;
        var stopNameId;
        var routeId;
        var route;
        var type;
        var tripId;
        events = [];
// Az events array els? eleme:
//        var refreshTimeFull = currTime.toTimeString();
//        var refreshTime = refreshTimeFull.substr(0, 8);
//        var refresh = {stop: "", line: "Frissítve:", stopHead: "", waiting: refreshTime};
//        events.push(refresh);
// A második eleme:
//        var headers = {stop: "Megálló³:", line: "Vonal:", stopHead: "Végállomás:", waiting: "Perc múlva indul:"};
//        events.push(headers);
        stops = body.data.references.stops;
        routes = body.data.references.routes;
        trips = body.data.references.trips;
        stopTimes = body.data.entry.stopTimes;
        for (i in stopTimes) {
			var depTime = stopTimes[i].predictedDepartureTime !== undefined ? stopTimes[i].predictedDepartureTime : stopTimes[i].departureTime;
            var departureTimeInMillis = depTime * 1000;
            depTime = new Date(departureTimeInMillis);
// A várakozási id?
            waitMin = parseInt((departureTimeInMillis - currentTime) / 1000 / 60);
            waitSec = parseInt((departureTimeInMillis - currentTime) / 1000) - (60 * waitMin);
// A megálló
            stopNameId = stopTimes[i].stopId;
            for (s in stops) {
                if (Object.is(stops[s].id, stopNameId)) {
                    stopName = stops[s].name;
                }
            }
//A vonal szám és típus
            tripId = stopTimes[i].tripId;
            for (t in trips) {
                if (Object.is(trips[t].id, tripId)) {
                    routeId = trips[t].routeId;
                    for (r in routes) {
                        if (Object.is(routes[r].id, routeId)) {
                            route = routes[r].shortName;
                            type = routes[r].type;
                        }
                    }
                }
            }
//A végállomás
            var stopHeadSign = stopTimes[i].stopHeadsign;
            if(stopHeadSign.length > 20){
			stopHeadSign = stopHeadSign.substr(0,22);
			}
// Ha a várakozás kevesebb, mint négy perc, nem érek ki a megállóba, így ezt nem jelenítem meg
            if (waitMin > 4 && stopNameId === "BKK_F03340") {
                var times = {stopId: stopNameId, stop: stopName, line: route, stopHead: stopHeadSign, waiting: waitMin, Routetype: type};
                events.push(times);
            }
            else if (waitMin > 8 ) {
                var times = {stopId: stopNameId, stop: stopName, line: route, stopHead: stopHeadSign, waiting: waitMin, Routetype: type};
                events.push(times);
            }
            
			
        }
        var m = 0;
		var h = 0;
		var r = 0;
        for(i in events){	
			if(events[i].stopId === "BKK_F03340"){
				m+= 1;
				}
			if(events[i].stopId === "BKK_F03420"){
				h += 1;
				}
			if(events[i].stopId === "BKK_F03308"){
				r += 1;
				}
		}
			if(m === 0){
				var times = {stopId: "BKK_F03340", stop: "Margit u.", line: "", stopHead: "Nincs j\u00E1rat...", waiting: "", Routetype: ""};
                events.push(times);
 //               console.log(times);
				}
			if(r === 0){
				var times = {stopId:"BKK_F03308" , stop: "HÉV", line: "", stopHead: "Nincs j\u00E1rat...", waiting: "", Routetype: ""};
                events.push(times);
 //               console.log(times);
				}
			if(h === 0){
				var times = {stopId: "BKK_F03420", stop: "Reptér", line: "", stopHead: "Nincs j\u00E1rat...", waiting: "", Routetype: ""};
                events.push(times);
 //               console.log(times);
				}
        this.bustimes = events;
        this.broadcastBKKFutar();
        this.scheduleUpdate();
    },
    broadcastBKKFutar: function () {
        this.sendSocketNotification("BKK-FUTAR_RECIEVED", this.bustimes);
    },
});
