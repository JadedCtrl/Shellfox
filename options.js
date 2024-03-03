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


// Create a <select> drop-down menu containing all of the user’s commands.
function createCommandMenu() {
	let commandMenu = document.createElement("SELECT");
	commandMenu.setAttribute("class", "commandMenu");
	commandMenu.setAttribute("type", "text");

	let savedCommands = savedArray("commands");
	for (let i = 0; i < savedCommands.length; i++) {
		let commandOption = document.createElement("OPTION");
		commandOption.setAttribute("value", i);
		commandOption.text = savedCommands[i][0];
		commandMenu.appendChild(commandOption);
	}
	return commandMenu;
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

	document.getElementById("commandTitle").innerText = browser.i18n.getMessage("optionsTitleShell");
	document.getElementById("commandP").innerText = browser.i18n.getMessage("optionsDescShell");
	document.getElementById("commandNameTh").innerText = browser.i18n.getMessage("optionsHeadShellName");
	document.getElementById("commandShellTh").innerText = browser.i18n.getMessage("optionsHeadShellCommand");

	document.getElementById("ruleTitle").innerText = browser.i18n.getMessage("optionsTitleRule");
	document.getElementById("ruleP").innerText = browser.i18n.getMessage("optionsDescRule");
	document.getElementById("ruleRegexTh").innerText = browser.i18n.getMessage("optionsHeadRuleName");
	document.getElementById("ruleShellTh").innerText = browser.i18n.getMessage("optionsHeadRuleCommand");

	document.getElementById("save-cmd").innerText = browser.i18n.getMessage("optionsSaveButton");
	document.getElementById("save-regex").innerText = browser.i18n.getMessage("optionsSaveButton");
}


document.addEventListener("click", e => {
	if (e.target.id == ("save-cmd")) {
		saveCommands();
		location.reload();
	} else if (e.target.id == ("save-regex")) {
		saveRegexRules();
		location.reload();
	}
});


populateCommandTable();
populateRegexTable();
i18nPage();
