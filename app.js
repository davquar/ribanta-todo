/* eslint-disable no-console */
const MENU_CLICKED = 1;
const COLOR_PICKER_ACTION_CLICKED = 2;

const newChecklistButton = document.querySelector("#btn-createList");
const board = document.querySelector("#board");

let taskCounter = 2;

function newChecklist() {
	board.innerHTML += `<div class="checklist bg-white" data-status="showTasks">
	<div class="header">
		<div class="name smallTitle" onfocus="document.execCommand('selectAll', false, null);" onblur="notEditable()" >Spesa</div>
		<a href="#"><img class="menu" src="icons/rounded-menu.svg" alt="Menu"></a>
	</div>
	<div class="tasks"></div>
	<div class="menu-content">
		<a href="#" class="rename">Rinomina</a>
		<a href="#" class="change-color">Cambia colore</a>
		<a href="#" class="remove">Elimina</a>
	</div>
	<div class="color-picker" >
		<div class="color-box bg-white active"></div>
		<div class="color-box bg-red"></div>
		<div class="color-box bg-pink"></div>
		<div class="color-box bg-purple"></div>
		<div class="color-box bg-blue"></div>
		<div class="color-box bg-cyan"></div>
		</br>
		<div class="color-box bg-green"></div>
		<div class="color-box bg-yellow"></div>
		<div class="color-box bg-orange"></div>
		<div class="color-box bg-brown"></div>
		<div class="color-box bg-grey"></div>
		<div class="color-box bg-dark"></div>
	</div>
</div>`;
	// call it with null event, to set the focus on the name of the newly added checklist
	toggleRename(null);
}

function handleChecklistView(checklist, intent) {
	const SHOW_TASKS = "showTasks";
	const SHOW_MENU = "showMenu";
	const SHOW_COLOR_PICKER = "showColorPicker";
	
	if (intent == MENU_CLICKED) {
		switch(checklist.dataset.status) {
		case SHOW_TASKS:
			checklist.dataset.status = SHOW_MENU;
			break;
		case SHOW_MENU:
			checklist.dataset.status = SHOW_TASKS;
			break;
		case SHOW_COLOR_PICKER:
			checklist.dataset.status = SHOW_MENU;
			break;
		}
	} else if (intent == COLOR_PICKER_ACTION_CLICKED) {
		checklist.dataset.status = SHOW_COLOR_PICKER;
	}
}

function toggleRename(event) {
	// if the event is null, it means that toggleRename has been called by newChecklist
	// in that case, just select the last checklist and set the focus on its name.
	const name = event ? event.composedPath()[2].querySelector(".header .name") : board.querySelector(".checklist:last-of-type").querySelector(".header .name");
	name.contentEditable = true;
	name.focus();
}

function deleteChecklist(event) {
	const checklist = event.composedPath()[2];
	checklist.parentNode.removeChild(checklist);
}

function notEditable(){
	const name = event.composedPath()[2].querySelector(".header .name");
	name.contentEditable = false;
	name.blur();
}

function changeColor(event) {
	const colorClass = event.target.classList[1];	// the color class should always be the third class in the style attribute
	const checklist = event.composedPath()[2];
	// the color class should always be the third class in the style attribute of the checklist
	if (checklist.classList.length > 1) checklist.classList.remove(checklist.classList[1]);
	checklist.classList.add(colorClass);
	updateCurrentColor(checklist);
}

function updateCurrentColor(checklist) {
	const colorClass = checklist.classList[1];
	checklist.querySelectorAll(".color-picker .color-box.active").forEach(box => box.classList.remove("active"));
	checklist.querySelector(`.color-picker .color-box.${colorClass}`).classList.add("active");
}

function addTask(checklist, value) {
	const tasks = checklist.querySelector(".tasks");
	tasks.innerHTML += `<div class="row"><input type="checkbox" id="task${++taskCounter}">
	<label for="task${taskCounter}" class="task-name">${value}</label></div>`;
}

function handleBoardClicks(event) {
	if (event.target.matches(".menu")) handleChecklistView(event.composedPath()[3], MENU_CLICKED);
	if (event.target.matches(".menu-content a.rename") || event.target.matches(".header .name")) toggleRename(event);
	if (event.target.matches(".menu-content a.remove")) deleteChecklist(event);
	if (event.target.matches(".menu-content a.change-color")) handleChecklistView(event.composedPath()[2], COLOR_PICKER_ACTION_CLICKED);
	if (event.target.matches(".color-box")) changeColor(event);
}

function handleBoardKeys(event) {
	// finish editing on Enter key
	if (event.target.matches(".header .name") && event.which == 13) {
		event.target.contentEditable = false;
	}

	if (event.target.matches(".task-adder input") && event.which == 13) {
		addTask(event.composedPath()[2], event.target.value);
		event.target.value = "";
	}
}
newChecklistButton.addEventListener("click", newChecklist);
board.addEventListener("click", handleBoardClicks);
board.addEventListener("keydown", handleBoardKeys);