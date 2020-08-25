
window.onload = () => {

    let tab = browser.tabs.query({active:true, currentWindow:true})
	.then(tabs => tabs[0])
    document.getElementById("leave").onclick = () => {
	tab.then(tab => {
	    getSession(tab.id)
	    .then(session => {
	        browser.tabs.remove(session.tabid)	
	        removeSession(session.tabid)
	    })
	})
	sendMessage(messageTypes.EXIT_ROOM)
    }

    let tokendisplay = document.getElementById("token")
    getToken(t => {
	console.log(t)
	tokendisplay.innerHTML = t
    })

    function getToken(func){
	setTimeout(() => {
	    tab.then(tab => {
		getSession(tab.id).then(s => {
		    if(s && s.token) func(s.token)
		    else getToken(func)
		})
	    })
	}, 50)
    }
}

