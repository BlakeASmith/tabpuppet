const HOST = "rooms.blakesmith.ca"
const PORT = 8080

var room
var member
 
function execScriptOnPageReload(script, tab){
    browser.webNavigation.onDOMContentLoaded.addListener(info => {
        if(info.frameId) return // top level windows only
        if(info.tabId != tab.id) return // only for this tab
	console.log(info.tabId)
        browser.tabs.executeScript({file:script})
	    .then(loaded => {
	        console.log("loaded", script, "into", tab.id, loaded)
	    })
    })
}

function beginHosting(url){
        room = new Room(HOST, PORT)
	room.onToken = token => {
	    // clicks will be sent as XPATH events
	    tab = browser.tabs.create({url:url})
	        .then((tab) => {
		    execScriptOnPageReload("/clicksync.js", tab)
	            saveSession(new Session(token, roles.HOST, tab.id))
		})
	}

	room.onPeerConnect((peer) => {
	    peer.write(JSON.stringify({url:url})) 
	})
}

function joinSession(token){
	member = new RoomMember(HOST, PORT, token)
	// create a new tab for the session and load mirroring script
	member.onMessageJson(m => {
	    if (m.url){
	        browser.tabs.create({url:m.url})
		    .then(tab => {
			saveSession(new Session(token, roles.MEMBER, tab.id))
			execScriptOnPageReload("/clickmirror.js", tab)
			member.onMessageJson((m) => {
			    // send messages from peer to mirroring script
			    browser.tabs.sendMessage(tab.id, m)
			})
		    })
	    }
	})
}

browser.runtime.onMessage.addListener((e) => {
	if (e.type == "new") beginHosting(e.url)
	else if (e.type == "join") joinSession(e.token)
	else if (e.type == "end") {
	        room = null
		member = null
	}else if (e.type == "xpath"){
		if (room){ // we are hosting a room
		    room.send(JSON.stringify(e))
	        }
	}
})
