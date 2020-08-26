browser.runtime.onMessage.addListener(m => {
    if (m.type == "xpath")
	clickXpath(m.xpath)
    else if (m.type == "url")
	goToUrl(m.url)

})
console.log("registerd message listener")


function clickXpath(xpath){
	console.log("clicking " + xpath)
	var el = getElementByXpath(xpath)
	el.click()
	console.log("clicked" + el)
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function goToUrl(url) {
    //  TODO:
    console.log(url)
}


