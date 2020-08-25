window.onload = () => {

function onCreateRoom(){
	tab.then(tab => sendMessage(messageTypes.NEW_ROOM(tab.url)))
}
    document.getElementById("create").onclick = onCreateRoom

    
let tab = browser.tabs.query({active:true, currentWindow:true})
    .then(tabs => tabs[0])

tab.then(tab => {
    console.log(tab.id)
    getSession(tab.id)
    .then(s => {
	console.log(s)
	if (s){
	    if (s.role == roles.HOST){
		window.location.href = "html/createroom.html"
	    }else window.location.href = "html/createroom.html"
	}
    })
})

}


