/* eslint-disable no-console */
const newChecklistButton = document.querySelector("#btn-createList");
const board = document.querySelector("#board");
/* const menuButtons = document.querySelectorAll(".menu a");
const renameButtons = document.querySelectorAll(".menu-content a.rename");
const removeButtons = document.querySelectorAll(".menu-content a.remove");
const checklistNames = document.querySelectorAll(".header .name");
 */
function newChecklist() {
	board.innerHTML += `<div class="checklist">
	<div class="header">
		<div class="name smallTitle" onfocus="document.execCommand('selectAll', false, null);" onblur="notEditable()" >Nuova checklist</div>
		<div class="menu"><a href="#"><img src="icons/rounded-menu.svg" alt="Menu"></a></div>
	</div>
	<div class="tasks"></div>
	<div class="menu-content displayNone">
		<a href="#" class="rename">Rinomina</a>
		<a href="#" onclick="document.getElementById('id01').style.display='block'" class="w3-button" >Cambia colore</a>
		<a href="#" class="remove">Elimina</a>
	</div>
</div>`;
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
	const name = event.path[2].querySelector(".header .name");
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

function getColor(col){
	document.getElementById("cl1").style.backgroundColor=col;
}

function handleBoardClicks(event) {
	if (event.target.matches(".menu")) toggleChecklistMenu(event);
	if (event.target.matches(".menu-content a.rename")) toggleRename(event);
	if (event.target.matches(".menu-content a.remove")) deleteChecklist(event);
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