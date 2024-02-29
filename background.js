let port = undefined;

// Run the shellfox helper program.
function initShellfoxProgram() {
	port = browser.runtime.connectNative("shellfox");
	port.onDisconnect.addListener((port) => {
		console.log(port.error);
		port = undefined;
	});
}


// Return the command-string associated with a URL, if any.
function getUrlCommand(url) {
	let matchCommand = undefined;
	let matchRegex = "";
	try {
		let savedCommands = JSON.parse(localStorage.getItem("commands"));
		// Find the most-applicable command…
		for (regexCommandPair of savedCommands) {
			let regex = regexCommandPair[0];
			let match = url.match(regex);
			let compared = compareRegexComplexity(matchRegex, regex);
			if (match && (compared == 0 || compared == 1)) {
				matchCommand = regexCommandPair[1];
				matchRegex = regex;
			}
		}
		// … and replace the substitution-string with the URL.
		matchCommand = matchCommand.replaceAll("%s", url);
	} catch {};
	return matchCommand;
}


// Execute the shell command associated with the given URL, if any.
function runUrlCommand(url) {
	let command = getUrlCommand(url);
	if (!port)
		initShellfoxProgram();
	if (command && port) {
		port.postMessage(command);
	}
}


// Compare two regular expressions, returning which one is more specific.
// Returns -1 if a is more specific, 1 if b is, and 0 if they are equal.
// It’s a simple (and unreliable) algorithm, for now — purely based on length.
function compareRegexComplexity(a, b) {
	if (a && ((a && !b) || (a.length > b.length)))
		return -1;
	else if (b && ((b && !a) || (a.length < b.length)))
		return 1
	return 0;
}


// Add a context-menu item for running the current page’s associated command.
function createContextMenuItem() {
	browser.menus.create(
		{
			id: "run-page-command",
			title: "Run shell command",
			contexts: ["page"]
		}
	);
}


// Simply remove the context-menu item.
function removeContextMenuItem() {
	browser.menus.remove("run-page-command");
}


// When the address-bar button is clicked, run the according command (if any).
browser.pageAction.onClicked.addListener((tab) => {
	runUrlCommand(tab.url);
});


// When a tab’s URL has been changed, enable/disable the address-bar button
// based on whether or not there is an according command.
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	let command = getUrlCommand(tab.url);
	if (command) {
		browser.pageAction.show(tabId);
		if (tab.active)
			createContextMenuItem();
	} else {
		browser.pageAction.hide(tabId);
		if (tab.active)
			removeContextMenuItem();
	}
});


// When the active tab has changed, enable/disable the address-bar button based
// on whether or not there is an according command for it.
browser.tabs.onActivated.addListener((activeInfo) => {
	browser.tabs.get(activeInfo.tabId).then((tab) => {
		if (getUrlCommand(tab.url)) {
			browser.pageAction.show(tab.id);
			createContextMenuItem();
		} else {
			browser.pageAction.hide(tab.id);
			removeContextMenuItem();
		}
	});
});


browser.menus.onClicked.addListener((info, tab) => {
	if (info.menuItemId == "run-page-command")
		runUrlCommand(tab.url);
});
