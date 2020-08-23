const SERVER = "ws://localhost:8989"

var host

class SessionHost {
    constructor() {
	this.peers = new Map()
	this.socket = new WebSocket(SERVER)

	this.socket.onopen = () => {
            this.socket.send("hosting")
	}

        this.socket.onmessage = message => {
	    let json = JSON.parse(message.data)
	    if (json.token){
	        console.log(json.token)
	        alert(json.token)
	    }
	    else {
		if(!this.peers.has(json.id)){
		    this.peers.set(json.id, this.createPeer(json.id))
		}
	        this.peers.get(json.id).signal(json.signal)
	    }
        }
    }

    send(message){
	for (let [key, peer] of this.peers.entries()){
		console.log(peer)
		if (peer.destroyed)
		    this.peers.delete(key)
		else
		    peer.write(message)
	}
    }

    createPeer(id){
        let peer = new SimplePeer()
	
        peer.on('signal', sig => {
	    this.socket.send(id)
	    this.socket.send(JSON.stringify(sig))
        })
	
	peer.on('connect', console.log)
        peer.on('data', (data) => {
    	    let decoder = new TextDecoder("utf-8")
	    console.log(decoder.decode(data))
        })

	return peer
    }
}

function socketedPeer(hosting){
    let peer = new SimplePeer({initiator:!hosting})
    let socket = new WebSocket(SERVER)
    socket.onopen = () => {
        if (hosting) socket.send("hosting")
        else {
	    socket.send("joining")
	    socket.send(getTokenFromInput())
	}
	
        peer.on('signal', sig => {
	    socket.send(JSON.stringify(sig))
        })
    }

    socket.onmessage = message => {
	json = JSON.parse(message.data)
	if (hosting && json.token){
	    console.log(json.token)
	    alert(json.token)
	}
	else {
	    peer.signal(json)
	}
    }

    peer.socket = socket

    return peer
}
/**
 * begin hosting a new session.
 */
function host(){
    host = new SessionHost()
}


function join(){
    let token = getTokenFromInput()
    peer = socketedPeer(false)
    peer.on('connect', () => {
        peer.send('hey peer2, how is it going?')
	if (host) host.send("testmessage")
    })
    peer.on('data', (data) => {
	    decoder = new TextDecoder("utf-8")
	    console.log(decoder.decode(data))
    })
}

function getTokenFromInput(){
    return document.getElementById("hash").value
}

window.onload = () => {
	document.getElementById("host").onclick = host
	document.getElementById("join").onclick = join
}



