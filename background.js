let port = browser.runtime.connectNative("shellfox");


port.onDisconnect.addListener((port) => {
	console.log(port.error);
	port = undefined;
});


browser.pageAction.onClicked.addListener(() => {
	port.postMessage("emacs /tmp/f");
});
