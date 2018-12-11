/* eslint-disable no-console */
const MENU_CLICKED = 1;
const COLOR_PICKER_ACTION_CLICKED = 2;

const newChecklistButton = document.querySelector("#btn-createList");
const board = document.querySelector("#board");

class Checklist {
	constructor(title, color, tasks) {
		this.title = title;
		this.color = color;
		this.tasks = tasks;
	}

	static fromHTML(checklist) {
		const title = checklist.querySelector(".name").innerHTML;
		const color = checklist.classList[1];
		const rows = Array.from(checklist.querySelectorAll(".tasks .row"));
		const tasks = rows.map(row => Task.fromHTML(row));
		return new Checklist(title, color, tasks);
	}

	static fromObj(obj) {
		const title = obj.title;
		const color = obj.color;
		const tasks = obj.tasks.map(task => Task.fromObj(task));
		return new Checklist(title, color, tasks);
	}

	toHTML() {
		return `<div class="checklist ${this.color}" data-status="showTasks">
		<div class="header">
			<div class="name smallTitle" onfocus="document.execCommand('selectAll', false, null);" onblur="notEditable()">${this.title}</div>
			<a><div class="menu invert"></div></a>
		</div>
		<div class="tasks">
			${this.tasks.map(task => task.toHTML()).join("")}
		</div>
		<div class="task-adder">
			<input type="text" name="new-task-name" placeholder="Nuovo elemento">
		</div>
		<div class="menu-content">
			<a class="rename">Rinomina</a>
			<a class="change-color">Cambia colore</a>
			<a class="remove">Elimina</a>
		</div>
		<div class="color-picker">
			<div class="color-box bg-white active"></div>
			<div class="color-box bg-red"></div>
			<div class="color-box bg-pink"></div>
			<div class="color-box bg-purple"></div>
			<div class="color-box bg-blue"></div>
			<div class="color-box bg-cyan"></div>
			<div class="color-box bg-green"></div>
			<div class="color-box bg-yellow"></div>
			<div class="color-box bg-orange"></div>
			<div class="color-box bg-bley"></div>
			<div class="color-box bg-grey"></div>
			<div class="color-box bg-dark"></div>
		</div>
	</div>`;
	}
	
	toString() {
		return JSON.stringify(this);
	}
}

class Task {
	constructor(name, id, checked) {
		this.name = name;
		this.id = id;
		this.checked = checked;
	}

	static fromHTML(row) {
		const name = row.querySelector(".task-name").innerHTML;
		const id = row.querySelector(".task-name").getAttribute("for");
		const checked = row.querySelector("input[type='checkbox']").checked;
		return new Task(name, id, checked);
	}

	static fromObj(obj) {
		const name = obj.name;
		const id = obj.id;
		const checked = obj.checked;
		return new Task(name, id, checked);
	}

	toHTML() {
		return `<div class="row">
		<input type="checkbox" id="${this.id}" data-checked="${this.checked}">
		<label for="${this.id}" class="task-name">${this.name}</label>
		<div class="delete-task invert"></div>
	</div>`;
	}

	toString() {
		return JSON.stringify(this);
	}
}

let taskCounter = 2;

function newChecklist() {
	board.innerHTML += new Checklist("Nuova checklist", "bg-white", []).toHTML();
	// call it with null event, to set the focus on the name of the newly added checklist
	toggleRename(null);
	refreshChecks();
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

function toggleRenameTask(event) {
	const name = event.target;
	name.contentEditable = true;
	name.focus();
	document.execCommand("selectAll", false, null);
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
	tasks.innerHTML += new Task(value, `task${++taskCounter}`, false).toHTML();
	refreshChecks();
}

function mapTaskCheck(event) {
	const task = event.target;
	task.dataset.checked = task.checked;
}

function refreshChecks() {
	board.querySelectorAll(".tasks .row input").forEach(check => check.checked = eval(check.dataset.checked));
	// why eval? because datasets always contain strings, so "false" is a truthy value, so we need to properly evaluate it.
}

function deleteTask(event) {
	const row = event.composedPath()[1];
	row.parentNode.removeChild(row);
}

function saveToStorage() {
	localStorage.setItem("counter", taskCounter);
	let checklists = Array.from(board.querySelectorAll(".checklist"));
	checklists = checklists.map(checklist => Checklist.fromHTML(checklist));
	localStorage.setItem("checklists", JSON.stringify(checklists));
}

function getFromStorage() {
	taskCounter = localStorage.getItem("counter");
	const json = JSON.parse(localStorage.getItem("checklists"));
	const objs = json.map(obj => Checklist.fromObj(obj));
	board.innerHTML = objs.map(checklist => checklist.toHTML()).join("");
	board.querySelectorAll(".tasks").forEach(tasks => refreshChecks(tasks));
}

function handleBoardClicks(event) {
	if (event.target.matches(".menu")) handleChecklistView(event.composedPath()[3], MENU_CLICKED);
	if (event.target.matches(".menu-content a.rename") || event.target.matches(".header .name")) toggleRename(event);
	if (event.target.matches(".menu-content a.remove")) deleteChecklist(event);
	if (event.target.matches(".menu-content a.change-color")) handleChecklistView(event.composedPath()[2], COLOR_PICKER_ACTION_CLICKED);
	if (event.target.matches(".color-box")) changeColor(event);
	if (event.target.matches(".tasks .row .delete-task")) deleteTask(event);
	if (event.target.matches(".tasks .row input")) mapTaskCheck(event);
	saveToStorage();
}

function handleBoardKeys(event) {
	// finish editing on Enter key
	if (event.target.matches(".header .name") && event.which == 13) {
		event.target.contentEditable = false;
	}

	if (event.target.matches(".tasks .row label") && event.which == 13) {
		event.target.contentEditable = false;
	}

	if (event.target.matches(".task-adder input") && event.which == 13) {
		addTask(event.composedPath()[2], event.target.value);
		event.target.value = "";
	}

	saveToStorage();
}

newChecklistButton.addEventListener("click", newChecklist);
board.addEventListener("click", handleBoardClicks);
board.addEventListener("keydown", handleBoardKeys);