Module.register("MMM-BKK-Futar", {
    // Default module config.
    defaults: {
        language: "en",
        initialLoadDelay: 0,
        updateInterval: 1000 * 60, // 60 Seconds
        mode: "dom"
    },
    getScripts: function () {
        return ['moment.js'];
    },
    getStyles: function () {
        return ['BKK-Futar.css'];
    },
    // Override socket notification handler.
    socketNotificationReceived: function (notification, payload) {

        if (notification === "BKK-FUTAR_RECIEVED") {
 
            this.onDataRecieved(payload);
        } else if (notification === "BKK_FUTAR_UNAVAILABLE" || payload === null) {
            this.resume();
            this.onDataRecieved(["BKK-Futar hiba :("]);
        } else if (notification === "BKK_FUTAR_ERROR") {

            this.onDataRecieved(["Unknown error :("]);
        }
    },
    notificationReceived: function (notification, payload, sender) {

        if (notification === "DOM_OBJECTS_CREATED") {
            this.registerBKKFutarWorker();
        }
        if (sender) {

            if (notification === "BKKFUTAR_START") {
                this.registerBKKFutarWorker();
            } else if (notification === "BKKFUTAR_STOP") {
                this.killBKKFutarWorker();
                this.sendNotification("HIDE_ALERT");
            }
        }
    },
    suspend: function () {
        this.killBKKFutarWorker();
    },
    resume: function () {
        this.registerBKKFutarWorker();
    },
    onDataRecieved: function (data) {
        if (this.config.mode == "dom") {
            Log.log("MMM-BKK-Futar recieved data, updating dom");
            this.bkkFutarPayload = data;
            var updateTime = moment().format("hh:mm");
            this.data.header = "Menetrend, " + updateTime;
            this.updateDom(2000);
        }
    },
//Megjeleníti a helpert?l kapott adatokat
    getDom: function () {
       
        data = this.bkkFutarPayload;
        var wrapper = document.createElement("div");
        wrapper.className = "small";
        
        
        if (this.bkkFutarPayload === undefined) {
            wrapper.innerHTML = "Loading...";
            this.resume();
        }
        else{
		var hevWrapper = document.createElement("table");
        hevWrapper.className = "small normal";
       var hevHeader1 = document.createElement("th");
        hevHeader1.innerHTML = "";
        hevHeader1.className = "header1";
        hevWrapper.appendChild(hevHeader1);
        var hevHeader2 = document.createElement("th");
        hevHeader2.innerHTML = "";
        hevHeader2.className = "header2";
        hevWrapper.appendChild(hevHeader2);
        var hevHeader = document.createElement("th");
        hevHeader.innerHTML = "H\u00e9v";
        hevHeader.className = "header3 bright";
        hevWrapper.appendChild(hevHeader);
        var hevHeader3 = document.createElement("th");
        hevHeader3.innerHTML = "";
        hevHeader3.className = "header4";
        hevWrapper.appendChild(hevHeader3);
        var busWrapper = document.createElement("table");
        busWrapper.className = "small normal";
        var busHeader1 = document.createElement("th");
        busHeader1.innerHTML = "";
        busHeader1.className = "header1";
        busWrapper.appendChild(busHeader1);
        var busHeader2 = document.createElement("th");
        busHeader2.innerHTML = "";
        busHeader2.className = "header2";
        busWrapper.appendChild(busHeader2);
        var busHeader = document.createElement("th");
        busHeader.innerHTML = "Rept\u00e9r";
        busHeader.className = "header3 bright";
        busWrapper.appendChild(busHeader);
        var busHeader3 = document.createElement("th");
        busHeader3.innerHTML = "";
        busHeader3.className = "header4";
        busWrapper.appendChild(busHeader3);
        var margitWrapper = document.createElement("table");
        margitWrapper.className = "small normal";
        var margitHeader1 = document.createElement("th");
        margitHeader1.innerHTML = "";
        margitHeader1.className = "header1";
        margitWrapper.appendChild(margitHeader1);
        var margitHeader2 = document.createElement("th");
        margitHeader2.innerHTML = "";
        margitHeader2.className = "header2";
        margitWrapper.appendChild(margitHeader2);
        var margitHeader = document.createElement("th");
        margitHeader.innerHTML = "Margit u.";
        margitHeader.className = "header3 bright";
        margitWrapper.appendChild(margitHeader);
        var margitHeader3 = document.createElement("th");
        margitHeader3.innerHTML = "";
        margitHeader3.className = "header4";
        margitWrapper.appendChild(margitHeader3);
        for (i in data) {
			console.log("stopId: "+data[i].stopId +", stopHead: "+data[i].stopHead +", stop: "+ data[i].stop + ", line: " + data[i].line);
			var type = data[i].Routetype;
			var iconWrapper = document.createElement("i"); 
            if (type === "BUS") {
                iconWrapper.className = "fa fa-bus";
            } else if (type === "RAIL") {
                iconWrapper.className = "fa fa-train";
            } else if (type === "TRAM") {
                iconWrapper.className = "fa fa-subway";
            }
            var stopId = data[i].stopId;      
			if(stopId === "BKK_F03420"){
          var hevContentWrapper = document.createElement("tbody");
            hevContentWrapper.className = "small normal";
			hevContentWrapper.appendChild(iconWrapper);
			
            var hevLineWrapper = document.createElement("td");
            var hevLine = data[i].line;
            hevLineWrapper.innerHTML = hevLine;
            hevContentWrapper.appendChild(hevLineWrapper);

            var hevStopWrapper = document.createElement("td");
            hevStopWrapper.innerHTML = data[i].stopHead;
            hevContentWrapper.appendChild(hevStopWrapper);

            var hevWaitWrapper = document.createElement("td");
            hevWaitWrapper.innerHTML = data[i].waiting;
            hevContentWrapper.appendChild(hevWaitWrapper);
        
            hevWrapper.appendChild(hevContentWrapper);
			}
			
			if(stopId === "BKK_F03308"){
            var busContentWrapper = document.createElement("tr");
            busContentWrapper.className = "small normal";
			busContentWrapper.appendChild(iconWrapper);
			
            var busLineWrapper = document.createElement("td");
            var busLine = data[i].line;
            busLineWrapper.innerHTML = busLine;
            busContentWrapper.appendChild(busLineWrapper);

            var busStopWrapper = document.createElement("td");
            busStopWrapper.innerHTML = data[i].stopHead;
            busContentWrapper.appendChild(busStopWrapper);

            var busWaitWrapper = document.createElement("td");
            busWaitWrapper.innerHTML = data[i].waiting;
            busContentWrapper.appendChild(busWaitWrapper);
            busWrapper.appendChild(busContentWrapper);
			}
            if(stopId === "BKK_F03340"){
            var margitContentWrapper = document.createElement("tr");
            margitContentWrapper.className = "small normal"; 
			margitContentWrapper.appendChild(iconWrapper);
			
            var margitLineWrapper = document.createElement("td");
            var margitLine = data[i].line;
            margitLineWrapper.innerHTML = margitLine;
            margitContentWrapper.appendChild(margitLineWrapper);

            var margitStopWrapper = document.createElement("td");
            margitStopWrapper.innerHTML = data[i].stopHead;
            margitContentWrapper.appendChild(margitStopWrapper);

            var margitWaitWrapper = document.createElement("td");
            margitWaitWrapper.innerHTML = data[i].waiting;
            margitContentWrapper.appendChild(margitWaitWrapper);
            margitWrapper.appendChild(margitContentWrapper);
			}
        }
	}
        if ( hevWrapper != null ){
            wrapper.appendChild(hevWrapper);
        }
        if ( busWrapper != null ){
            wrapper.appendChild(busWrapper);
        }
        if ( margitWrapper != null ) {
            wrapper.appendChild(margitWrapper);
        }
        return wrapper;
    }, start: function () {
        Log.log("Starting module this: " + this.name);
    },
    killBKKFutarWorker: function () {
        this.sendSocketNotification("BKK-FUTAR_KILL_WORKER");
    },
    registerBKKFutarWorker: function () {
        console.log("Reogisterfutarworker " + this.name);
        this.sendSocketNotification("BKK-FUTAR_START_WORKER", {
            config: this.config
        });
    }
});
