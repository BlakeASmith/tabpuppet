
window.onload = () => {
    document.getElementById("submit").onclick = () => {
	let token = document.getElementById("hashin").value
	sendMessage(messageTypes.JOIN_ROOM(token))
    }
}
