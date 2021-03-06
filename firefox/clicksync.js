document.addEventListener('click', e => getAndSendXpath(e))

function getAndSendXpath(e){
        let xpath = getPathTo(e.target)
	console.log(xpath)
	browser.runtime.sendMessage({type:"xpath", xpath:xpath})
}



function getPathTo(element) {
    if (element.tagName == 'HTML')
        return '/HTML[1]';
    if (element===document.body)
        return '/HTML[1]/BODY[1]';

    var ix= 0;

    var siblings= element.parentNode.childNodes;

    for (var i= 0; i<siblings.length; i++) {
        var sibling= siblings[i];
        if (sibling===element)
            return getPathTo(element.parentNode)+'/'+element.tagName+'['+(ix+1)+']';
        if (sibling.nodeType===1 && sibling.tagName===element.tagName)
            ix++;
    }
}


