/* eslint-disable no-console */
const newChecklistButton = document.querySelector("#btn-createList");
const board = document.querySelector("#board");

function newChecklist() {
	board.innerHTML += `<div class="checklist">
	<div class="header">
		<div class="name smallTitle" onfocus="document.execCommand('selectAll', false, null);" onblur="notEditable()" >Nuova checklist</div>
		<a href="#"><img src="icons/rounded-menu.svg" class="menu" alt="Menu"></a>
	</div>
	<div class="tasks"></div>
	<div class="menu-content displayNone">
		<a href="#" class="rename">Rinomina</a>
		<a href="#" onclick="document.getElementById('id01').style.display='block'" class="w3-button" >Cambia colore</a>
		<a href="#" class="remove">Elimina</a>
	</div>
</div>`;
	// call it with null event, to set the focus on the name of the newly added checklist
	toggleRename(null);
}

function toggleChecklistMenu(event) {
	const tasks = event.path[3].querySelector(".tasks");
	const menuContent = event.path[3].querySelector(".menu-content");

	if (menuContent.classList.contains("show")) {
		menuContent.classList.remove("show");
		menuContent.classList.add("displayNone");
		tasks.classList.remove("displayNone");
		return;
	}
	menuContent.classList.add("show");
	menuContent.classList.remove("displayNone");
	tasks.classList.add("displayNone");
}

function toggleRename(event) {
	// if the event is null, it means that toggleRename has been called by newChecklist
	// in that case, just select the last checklist and set the focus on its name.
	const name = event ? event.path[2].querySelector(".header .name") : board.querySelector(".checklist:last-of-type").querySelector(".header .name");
	name.contentEditable = true;
	name.focus();
}

function deleteChecklist(event) {
	const checklist = event.path[2];
	checklist.parentNode.removeChild(checklist);
}

function notEditable(){
	const name = event.path[2].querySelector(".header .name");
	name.contentEditable = false;
	name.blur();
}

function changeColor(event) {
	const colorClass = event.target.classList[1];	// the color class should always be the second class in the style attribute
	const checklist = event.path[2];
	// the color class should always be the second class in the style attribute of the checklist
	if (checklist.classList.length > 1) checklist.classList.remove(checklist.classList[1]);
	checklist.classList.add(colorClass);
	updateCurrentColor(checklist);
}

function updateCurrentColor(checklist) {
	const colorClass = checklist.classList[1];
	checklist.querySelectorAll(".color-picker .color-box.active").forEach(box => box.classList.remove("active"));
	checklist.querySelector(`.color-picker .color-box.${colorClass}`).classList.add("active");
}

function handleBoardClicks(event) {
	if (event.target.matches(".menu")) toggleChecklistMenu(event);
	if (event.target.matches(".menu-content a.rename") || event.target.matches(".header .name")) toggleRename(event);
	if (event.target.matches(".menu-content a.remove")) deleteChecklist(event);
	if (event.target.matches(".color-box")) changeColor(event);
}

function handleBoardKeys(event) {
	// finish editing on Enter key
	if (event.target.matches(".header .name") && event.which == 13) {
		event.target.contentEditable = false;
	}
}
newChecklistButton.addEventListener("click", newChecklist);
board.addEventListener("click", handleBoardClicks);
board.addEventListener("keydown", handleBoardKeys);