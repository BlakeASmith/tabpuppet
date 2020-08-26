const HOST = "localhost"
const PORT = 8989

/**
 * begin hosting a new session.
 */
function host(){
    console.log("opening room")
    let host = new Room(HOST, PORT)
    host.onToken = (it) => alert(it)
    host.onMessage((m) => {
	host.send("welcome")
	console.log(m.data)
    })
}

function join(){
    let token = getTokenFromInput()
    let me = new RoomMember(HOST, PORT, token)
    me.onMessage((mess) => console.log(mess))
    me.send("hi")
}

function getTokenFromInput(){
    return document.getElementById("hash").value
}

window.onload = () => {
	document.getElementById("host").onclick = host
	document.getElementById("join").onclick = join
}



