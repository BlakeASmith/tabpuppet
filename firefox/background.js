const HOST = "localhost"
const PORT = 8989
const share_url = "http://www.blakesmith.ca/"

var room
var member

function beginHosting(){
        room = new Room(HOST, PORT)
	room.onToken = token => {
	    // clicks will be sent as XPATH events
	    tab = browser.tabs.create({url:share_url})
	        .then((tab) => {
			browser.tabs.executeScript({file:"/clicksync.js"})
	                saveSession(new Session(token, roles.HOST, tab.id))
		})
	}
}

function joinSession(token, url){
	member = new RoomMember(HOST, PORT, token)
	// create a new tab for the session and load mirroring script
	browser.tabs.create({url:"http://www.blakesmith.ca"})
	    .then((tab) => {
	        saveSession(new Session(token, roles.MEMBER, tab.id))
		browser.tabs.executeScript({file:"/clickmirror.js"})
	        member.onMessageJson((m) => {
		    // send messages from peer to mirroring script
		    console.log(m)
	            if (m.url) {
			browser.tabs.sendMessage(tab.id, {type: "url", url:m.url})
		    } else browser.tabs.sendMessage(tab.id, m)
		})
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