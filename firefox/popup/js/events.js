const messageTypes = {
    NEW_ROOM: (url) => { return {type:"new", url:url} },
    JOIN_ROOM: (token) => { return {type:"join", token:token} },
    EXIT_ROOM: {type: "end"},
    ON_TOKEN: (token) => { return {type:"ontoken", token:token} },
    XPATH: (xpath) => { return {type:"xpath", xpath:xpath} },
}

const roles = {
    HOST: "host",
    MEMBER: "member"
}

class Session {
    constructor(token, role, tabid){
	this.token = token
	this.role = role
	this.tabid = tabid
    }
}

function getSession(tabid){
    return browser.storage.local.get(`session${tabid}`)
	.then(o => o[`session${tabid}`])
}

function sendMessage(message){
    browser.runtime.sendMessage(message)
}

function saveSession(session){
    let storage = {}
    storage[`session${session.tabid}`] = session
    console.log(storage)
    browser.storage.local.set(storage)
}

function removeSession(tabid){
    browser.storage.local.remove(`session${tabid}`)
}



