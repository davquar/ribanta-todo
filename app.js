/* eslint-disable no-console */
const menuButtons = document.querySelectorAll(".menu a");

function toggleChecklistMenu(event) {
	console.log(event.path[4]);
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

menuButtons.forEach(btn => btn.addEventListener("click", toggleChecklistMenu));