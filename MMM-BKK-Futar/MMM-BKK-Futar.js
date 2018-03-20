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
        Log.log(this.name + " received a socket notification first: " + notification);
        if (notification === "BKK-FUTAR_RECIEVED") {
            Log.log(this.name + " received a socket notification: " + notification + " payload: " + payload.toString());
            this.onDataRecieved(payload);
        } else if (notification === "BKK_FUTAR_UNAVAILABLE") {
            Log.log(this.name + " received a socket notification: " + notification);
            this.resume();
            this.onDataRecieved(["BKK-Futar hiba :("]);
        } else if (notification === "BKK_FUTAR_ERROR") {
            Log.log(this.name + " received a socket notification: " + notification);
            this.onDataRecieved(["Unknown error :("]);
        }
    },
    notificationReceived: function (notification, payload, sender) {
        Log.log(this.name + " received a notification: " + notification);
        if (notification === "DOM_OBJECTS_CREATED") {
            this.registerBKKFutarWorker();
        }
        if (sender) {
            Log.log(this.name + " received a module notification: " + notification + " from sender: " + sender.name);
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
            this.updateDom(2000);
        }
    },
//Megjeleníti a helpert?l kapott adatokat
    getDom: function () {
        data = this.bkkFutarPayload;
        var first = true;
        var wrapper = document.createElement("table");
        wrapper.className = "small bright";
        if (this.bkkFutarPayload === undefined) {
            wrapper.innerHTML = "Hmm... Nincs adat :(";
        }
        for (i in data) {
            var contentWrapper = document.createElement("tr");
            contentWrapper.className = "border_bottom" + (first ? " border_top font" : "");
            var type = data[i].Routetype;
            if (type === "BUS") {
                contentWrapper.className = "color_BUS";
            } else if (type === "RAIL") {
                contentWrapper.className = "color_HEV";
            } else if (type === "TRAM") {
                contentWrapper.className = "color_TRAM";
            }


            var lineWrapper = document.createElement("td");
            var line = data[i].line;
            lineWrapper.innerHTML = line;
            contentWrapper.appendChild(lineWrapper);

            var endWrapper = document.createElement("td");
            endWrapper.innerHTML = data[i].stop;
            contentWrapper.appendChild(endWrapper);

            var stopWrapper = document.createElement("td");
            stopWrapper.innerHTML = data[i].stopHead;
            contentWrapper.appendChild(stopWrapper);

            var waitWrapper = document.createElement("td");
            waitWrapper.innerHTML = data[i].waiting;
            contentWrapper.appendChild(waitWrapper);

            first = false;
            wrapper.appendChild(contentWrapper);
        }

        return wrapper;
    },
    start: function () {
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
