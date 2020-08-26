class Room {
    constructor(host, port) {
	this.server = `ws://${host}:${port}`
	this.peers = new Map()
	this.socket = new WebSocket(this.server)
	this.onToken = console.log
        let decoder = new TextDecoder("utf-8")
	this.decode = (data) => decoder.decode(data)
	

	this.socket.onopen = () => {
            this.socket.send("hosting")
	}

        this.socket.onmessage = message => {
	    let json = JSON.parse(message.data)
	    if (json.token){
		this.token = json.token
		this.onToken(this.token)
	    }
		    
	    else {
		if(!this.peers.has(json.id)){
		    this.peers.set(json.id, this.createPeer(json.id))
		}
	        this.peers.get(json.id).signal(json.signal)
	    }
        }

	this.log = []
	this.onMessageListeners = []
    }

    send(message){
	for (let [key, peer] of this.peers.entries()){
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

	peer.on('data', data => {
	    for (let action of this.onMessageListeners){
		action(this.decode(data))
	    }
	    this.log.push(data)
	})
	
	return peer
    }

    onMessage(func){
        this.onMessageListeners.push(func)	
    }
}

class RoomMember {
    constructor(host, port, token){
	this.server = `ws://${host}:${port}`
	this.token = token
	this.conn = new SimplePeer({initiator:true})
	this.socket = new WebSocket(this.server)
        this.socket.onopen = () => {
	    this.socket.send("joining")
	    this.socket.send(token)
	}
        this.conn.on('signal', sig => this.socket.send(JSON.stringify(sig)))
        this.socket.onmessage = message => this.conn.signal(JSON.parse(message.data))

        this.decoder = new TextDecoder("utf-8")
    }

    onConnect(func){
	this.conn.on('connect', func)
    }

    onMessage(func){
	this.conn.on('data', data => func(this.decoder.decode(data)))
    }

    send(message){
	this.conn.write(message)
    }

}

