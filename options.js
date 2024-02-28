// Iterate over the commands-table and save each of the user’s valid
// regex+command rows to storage.
function saveCommands() {
	let commands = [];
	for (commandTr of document.getElementsByClassName("regexCommandRow")) {
		let regex = commandTr.getElementsByClassName("regex")[0].value;
		let command = commandTr.getElementsByClassName("command")[0].value;
		if (regex && command)
			commands.push([regex, command]);
	}
	localStorage.setItem("commands", JSON.stringify(commands));
}


// Read the user’s saved command-regex pairs from storage, and populate the
// command-table with them.
function populateCommandTable() {
	let commandTable = document.getElementById("commandTable");
	for (cmdRegex of JSON.parse(localStorage.getItem("commands"))) {
		let commandTr = createCommandTr(cmdRegex[0], cmdRegex[1]);
		commandTable.appendChild(commandTr);
	}
	// Always add a spare entry.
	commandTable.appendChild(createCommandTr("", ""));
}


// Create a table-row for the command-table, with the command & regex inputs’
// values set to the given parameters. If they are undefined, the inputs will
// have no value.
function createCommandTr(regex, command) {
	let regexInput = document.createElement("INPUT");
	regexInput.setAttribute("class", "regex");
	regexInput.setAttribute("type", "text");
	regexInput.setAttribute("placeholder", "https://example.com/*");
	if (regex && command)
		regexInput.setAttribute("value", regex);

	let regexTd = document.createElement("TD");
	regexTd.appendChild(regexInput);

	let commandInput = document.createElement("INPUT");
	commandInput.setAttribute("class", "command");
	commandInput.setAttribute("type", "text");
	commandInput.setAttribute("placeholder", "curl %s > /tmp/downloaded");
	if (regex && command)
		commandInput.setAttribute("value", command);

	let commandTd = document.createElement("TD");
	commandTd.appendChild(commandInput);

	let tr = document.createElement("TR");
	tr.setAttribute("class", "regexCommandRow");
	tr.appendChild(regexTd);
	tr.appendChild(commandTd);
	return tr;
}


document.addEventListener("click", e => {
	if (e.target.id == ("save")) {
		saveCommands();
		location.reload();
	}
});


populateCommandTable();
