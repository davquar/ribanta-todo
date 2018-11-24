/* eslint-disable no-console */
const menuButtons = document.querySelectorAll(".menu a");
const renameButtons = document.querySelectorAll(".menu-content a.rename");
const removeButtons = document.querySelectorAll(".menu-content a.remove");
const checklistNames = document.querySelectorAll(".header .name");

function toggleChecklistMenu(event) {
	const tasks = event.path[4].querySelector(".tasks");
	const menuContent = event.path[4].querySelector(".menu-content");

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

function keyDown(event) {
	// finish editing on Enter key
	if (event.which == 13) {
		event.target.contentEditable = false;
	}
}

function deleteChecklist(event) {
	const checklist = event.path[2];
	checklist.parentNode.removeChild(checklist);
}

menuButtons.forEach(btn => btn.addEventListener("click", toggleChecklistMenu));
renameButtons.forEach(btn => btn.addEventListener("click", toggleRename));
removeButtons.forEach(btn => btn.addEventListener("click", deleteChecklist));

checklistNames.forEach(div => div.addEventListener("keydown", keyDown));