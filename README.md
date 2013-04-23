This is a script that you can use to tell if you're connected to the internet for offline applications.
```
var offlineMgr = $.offlineManager(10000);
```
This will poll a URL every 10 seconds to check for an active connection. If it fails, assume we're offline.
```
offlineMgr.online(function() { console.log('I am online.'); }).offline(function() { console.log('I am offline'); });
```
Will log useful messages

```
offlineMgr.isOnline()
```
Will tell you your state.

TODO - This has a bit of a rocky start, I'm still working on it.