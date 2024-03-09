// Given the name of an array saved to localStorage, return it (if possible).
function savedArray(name) {
	try {
		let saved = JSON.parse(localStorage.getItem(name));
		return saved;
	} catch { return []; };
}


// Iterate over the commands-table and save each of the user’s valid
// name+command rows to storage.
function saveCommands() {
	let commands = [];
	for (commandTr of document.getElementsByClassName("nameCommandRow")) {
		let name = commandTr.getElementsByClassName("name")[0].value;
		let command = commandTr.getElementsByClassName("command")[0].value;
		if (name && command)
			commands.push([name, command]);
	}
	localStorage.setItem("commands", JSON.stringify(commands));
}


// Iterate over the regex-table and save each of the user’s valid
// regex+command-index rows to storage.
function saveRegexRules() {
	let rules = [];
	for (regexTr of document.getElementsByClassName("regexCommandRow")) {
		let regex = regexTr.getElementsByClassName("regex")[0].value;
		let command_i = regexTr.getElementsByClassName("commandMenu")[0].value;
		if (regex && command_i)
			rules.push([regex, command_i]);
	}
	localStorage.setItem("urlRules", JSON.stringify(rules));
}


// Iterate over the commands-table and save each of the user’s valid
// name+command rows to storage.
function saveDownloadCommands() {
	let downloads = [];
	for (downloadTr of document.getElementsByClassName("downloadCommandRow")) {
		let regex = downloadTr.getElementsByClassName("regex")[0].value;
		let command = downloadTr.getElementsByClassName("command")[0].value;
		let type = downloadTr.getElementsByClassName("startFinishMenu")[0].value;
		if (regex && command && type)
			downloads.push([regex, command, type]);
	}
	console.log(downloads);
	localStorage.setItem("downloadCommands", JSON.stringify(downloads));
}


// Read the user’s saved name+command pairs from storage, and populate the
// command-table with them.
function populateCommandTable() {
	let commandTable = document.getElementById("commandTable");
	try {
		let savedCommands = savedArray("commands");
		for (cmdName of savedCommands) {
			let commandTr = createCommandTr(cmdName[0], cmdName[1]);
			commandTable.appendChild(commandTr);
		}
	} catch { };
	// Always add a spare entry.
	commandTable.appendChild(createCommandTr("", ""));
}


// Read the user’s saved regex+command-index pairs from storage, and populate the
// command-table with them.
function populateRegexTable() {
	let regexTable = document.getElementById("regexTable");
	try {
		let savedRegex = savedArray("urlRules");
		for (let i = 0; i < savedRegex.length; i++) {
			let regexTr = createRegexTr(savedRegex[i][0], savedRegex[i][1], createCommandMenu());
			regexTable.appendChild(regexTr);
		}
	} catch { };
	// Always, again, have a spare tire!!
	regexTable.appendChild(createRegexTr("", "", createCommandMenu()));
}


// Read the user’s saved type+name+command pairs from storage, and populate the
// downloads-table with them.
function populateDownloadTable() {
	let downloadTable = document.getElementById("downloadTable");
	try {
		let savedDownloads = savedArray("downloadCommands") || [];
		for (regexCommandType of savedDownloads) {
			let downloadTr = createDownloadTr(regexCommandType[0], regexCommandType[1], regexCommandType[2]);
			downloadTable.appendChild(downloadTr);
		}
	} catch {};
	// And yet again! Have spares!!!
	downloadTable.appendChild(createDownloadTr("", "", 0));
}


// Create a <select> drop-down menu containing all of the user’s commands.
function createCommandMenu() {
	let commandMenu = document.createElement("SELECT");
	commandMenu.setAttribute("class", "commandMenu");
	commandMenu.setAttribute("type", "text");

	let savedCommands = savedArray("commands") || [];
	for (let i = 0; i < savedCommands.length; i++) {
		let commandOption = document.createElement("OPTION");
		commandOption.setAttribute("value", i);
		commandOption.text = savedCommands[i][0];
		commandMenu.appendChild(commandOption);
	}
	return commandMenu;
}


function createDownloadTypeMenu(type) {
	let typeMenu = document.createElement("SELECT");
	typeMenu.setAttribute("class", "startFinishMenu");
	typeMenu.setAttribute("type", "text");

	let onStartOption = document.createElement("OPTION");
	onStartOption.setAttribute("value", 0);
	onStartOption.text = browser.i18n.getMessage("optionsDownloadWhenStarted");
	typeMenu.appendChild(onStartOption);

	let onEndOption = document.createElement("OPTION");
	onEndOption.setAttribute("value", 1);
	onEndOption.text = browser.i18n.getMessage("optionsDownloadWhenFinished");
	typeMenu.appendChild(onEndOption);

	try {
		typeMenu.childNodes[type].setAttribute("selected", true);
	} catch { };

	return typeMenu;
}


function createDownloadTr(regex, command, type) {
	let typeMenu = createDownloadTypeMenu(type);

	let typeTd = document.createElement("TD");
	typeTd.appendChild(typeMenu);

	let regexInput = document.createElement("INPUT");
	regexInput.setAttribute("class", "regex");
	regexInput.setAttribute("type", "text");
	regexInput.setAttribute("placeholder",
		browser.i18n.getMessage("optionsPlaceholderDownloadRegex"));
	if (regex && command && type)
		regexInput.setAttribute("value", regex);

	let regexTd = document.createElement("TD");
	regexTd.appendChild(regexInput);

	let commandInput = document.createElement("INPUT");
	commandInput.setAttribute("class", "command");
	commandInput.setAttribute("type", "text");
	commandInput.setAttribute("placeholder",
		browser.i18n.getMessage("optionsPlaceholderDownloadCommand"));
	if (regex && command && type)
		commandInput.setAttribute("value", command);

	let commandTd = document.createElement("TD");
	commandTd.appendChild(commandInput);

	let tr = document.createElement("TR");
	tr.setAttribute("class", "downloadCommandRow");
	tr.appendChild(typeTd);
	tr.appendChild(regexTd);
	tr.appendChild(commandTd);
	return tr;
}


// Create a table-row for the command-table, with the command & regex inputs’
// values set to the given parameters. If they are undefined, the inputs will
// have no value.
function createRegexTr(regex, command_i, commandMenu) {
	let regexInput = document.createElement("INPUT");
	regexInput.setAttribute("class", "regex");
	regexInput.setAttribute("type", "text");
	regexInput.setAttribute("placeholder", browser.i18n.getMessage("optionsPlaceholderRule"));
	if (regex && command_i)
		regexInput.setAttribute("value", regex);

	let regexTd = document.createElement("TD");
	regexTd.appendChild(regexInput);

	let commandTd = document.createElement("TD");
	try {
		commandMenu.childNodes[command_i].setAttribute("selected", true);
	} catch { };
	commandTd.appendChild(commandMenu);

	let tr = document.createElement("TR");
	tr.setAttribute("class", "regexCommandRow");
	tr.appendChild(regexTd);
	tr.appendChild(commandTd);
	return tr;
}


// Create a table-row for the command-table, with the command & regex inputs’
// values set to the given parameters. If they are undefined, the inputs will
// have no value.
function createCommandTr(name, command) {
	let nameInput = document.createElement("INPUT");
	nameInput.setAttribute("class", "name");
	nameInput.setAttribute("type", "text");
	nameInput.setAttribute("placeholder", browser.i18n.getMessage("optionsPlaceholderName"));
	if (name && command)
		nameInput.setAttribute("value", name);

	let nameTd = document.createElement("TD");
	nameTd.appendChild(nameInput);

	let commandInput = document.createElement("INPUT");
	commandInput.setAttribute("class", "command");
	commandInput.setAttribute("type", "text");
	commandInput.setAttribute("placeholder", browser.i18n.getMessage("optionsPlaceholderCommand"));
	if (name && command)
		commandInput.setAttribute("value", command);

	let commandTd = document.createElement("TD");
	commandTd.appendChild(commandInput);

	let tr = document.createElement("TR");
	tr.setAttribute("class", "nameCommandRow");
	tr.appendChild(nameTd);
	tr.appendChild(commandTd);
	return tr;
}


// Replace the HTML elements’ text with the extension’s translations.
function i18nPage() {
	document.getElementsByTagName("html")[0].setAttribute("lang", browser.i18n.getMessage("@@ui_locale"));
	document.getElementsByTagName("title")[0].innerText = browser.i18n.getMessage("optionsPageTitle");

	document.getElementById("commandTitle").innerText = browser.i18n.getMessage("optionsTitleShell");
	document.getElementById("commandP").innerText = browser.i18n.getMessage("optionsDescShell");
	document.getElementById("commandNameTh").innerText = browser.i18n.getMessage("optionsHeadShellName");
	document.getElementById("commandShellTh").innerText = browser.i18n.getMessage("optionsHeadShellCommand");

	document.getElementById("ruleTitle").innerText = browser.i18n.getMessage("optionsTitleRule");
	document.getElementById("ruleP").innerText = browser.i18n.getMessage("optionsDescRule");
	document.getElementById("ruleRegexTh").innerText = browser.i18n.getMessage("optionsHeadRuleName");
	document.getElementById("ruleShellTh").innerText = browser.i18n.getMessage("optionsHeadRuleCommand");

	document.getElementById("downloadTitle").innerText = browser.i18n.getMessage("optionsTitleDownload");
	document.getElementById("downloadP").innerText = browser.i18n.getMessage("optionsDescDownload");
	document.getElementById("downloadRegexTh").innerText = browser.i18n.getMessage("optionsHeadDownloadRule");
	document.getElementById("downloadTypeTh").innerText = browser.i18n.getMessage("optionsHeadDownloadType");
	document.getElementById("downloadShellTh").innerText = browser.i18n.getMessage("optionsHeadDownloadCommand");

	document.getElementById("save-cmd").innerText = browser.i18n.getMessage("optionsSaveButton");
	document.getElementById("save-regex").innerText = browser.i18n.getMessage("optionsSaveButton");
	document.getElementById("save-downloads").innerText = browser.i18n.getMessage("optionsSaveButton");
}


document.addEventListener("click", e => {
	if (e.target.id == ("save-cmd")) {
		saveCommands();
		location.reload();
	} else if (e.target.id == ("save-regex")) {
		saveRegexRules();
		location.reload();
	} else if (e.target.id == ("save-downloads")) {
		saveDownloadCommands();
		location.reload();
	};
});


populateCommandTable();
populateRegexTable();
populateDownloadTable();
i18nPage();


// Only add CSS if we’re not in the Firefox-embedded settings, but
// rather, in our own tab.
if (!(location.toString().includes("?in_ui"))) {
	let cssElement = document.createElement("LINK");
	cssElement.setAttribute("rel", "stylesheet");
	cssElement.setAttribute("type", "text/css");
	cssElement.setAttribute("href", "error.css");
	document.getElementsByTagName("head")[0].appendChild(cssElement);
}
