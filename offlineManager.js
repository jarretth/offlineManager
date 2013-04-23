(function($) {
    $.offlineManager = function(interval, url) {
        var offlineUrl = url ? url : '/';
        var i = interval ? interval : 3000;
        var _si = null;
        var online = 1;
        var first = true;
        var networkConnection = true;
        var onlineCallbacks = [];
        var offlineCallbacks = [];
        var _online = function() {
            if(first || !online) {
                online = true;
                first = false;
                for(var k in onlineCallbacks) {
                    (onlineCallbacks[k])();
                }
            }
        }

        var _offline = function() {
            if(first || online) {
                online = first = false;
                for(var k in offlineCallbacks) {
                    (offlineCallbacks[k])();
                }
            }
        }

        var ping = function() {
            if(networkConnection) {
                $.ajax({url:offlineUrl,timeout: i, dataType:"text", type:"POST"})
                .done(function() { _online(); })
                .fail(function() { _offline(); });
            }
        }


        var startPing = function() {
            networkConnection = true;
            ping();
            if(!_si) _si = setInterval(ping,i);
        }

        var stopPing = function() {
            if(_si) { clearInterval(_si); _si = null; }
            _offline();
            networkConnection = false;
        }

        if(navigator.hasOwnProperty('onLine')) {
            networkConnection = navigator.onLine;
            $(window).bind('offline',stopPing);
            $(window).bind('online',startPing);
            if(networkConnection) startPing();
            else stopPing();
        } else {
            startPing();
        }

        return {
            online: function(callback) {
                if(callback == undefined) {
                    _online();
                } else if(callback instanceof Function) {
                    onlineCallbacks.push(callback);
                    !first && this.isOnline() && callback();
                }
                return this;
            },
            offline: function(callback) {
                if(callback == undefined) {
                    _offline();
                } else if(callback instanceof Function) {
                    offlineCallbacks.push(callback);
                    !first && !this.isOnline() && setTimeout(callback,1); //if we are appcached and have no network connection, we need this delay in the case where the offline callback references the object that this returns
                }
                return this;
            },
            isOnline: function() { return networkConnection && !!online; },
            isInitialized: function() { return !first; },
            updateInterval: function(interval) {
                i = interval;
                if(_si) {
                    clearInterval(_si);
                    _si = setInterval(ping,i);
                }
                return this;
            },
            updateURL: function(url) {
                offlineUrl = url;
                return this;
            }
        };
    }
})(jQuery);