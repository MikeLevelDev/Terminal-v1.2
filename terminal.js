import { setVolume } from "./util/speak.js";
import { click } from "./sound/index.js";
import { on, off } from "./util/power.js";
import { toggleFullscreen } from "./util/screens.js";
import { type } from "./util/io.js";


async function onload() {
	const urlParams = new URLSearchParams(window.location.search);
	const command = urlParams.get("command");

	if (command) {
		const { power } = await import("./util/power.js");
		const { parse } = await import("./util/io.js");
		power();
		await type("> " + command, { initialWait: 3000, finalWait: 1500 });
		await parse(command);

		const { main } = await import("./util/screens.js");
		main();
	}
}


async function debug() {
	const { power } = await import("./util/power.js");
	const { main } = await import("./util/screens.js");
	const { parse } = await import("./util/io.js");
	power();
	main();
	parse("fallout");
}

function togglePower() {
	let isOff = document.getElementById("crt").classList.contains("off");
	if (isOff) {
		on();
	} else {
		off();
	}
}

function handleClick(event) {
	if (event) {
		event.preventDefault();
	}
	let input = document.querySelector("[contenteditable='true']");
	if (input) {
		input.focus();
	}
}

function fly(event) {
	event.target.classList.toggle("fly");
}

function theme(event) {
	click();
	let theme = event.target.dataset.theme;
	[...document.getElementsByClassName("theme")].forEach(b =>
		b.classList.toggle("active", false)
	);
	event.target.classList.add("active");
	document.body.classList = "theme-" + theme;
	handleClick();
}

function fullscreen(event) {
	toggleFullscreen();
	event.target.blur();
}

function globalListener({ keyCode }) {
	if (keyCode === 122) {
		
		toggleFullscreen();
	} else if (keyCode === 27) {
		
		toggleFullscreen(false);
	}
}
document.addEventListener("keydown", globalListener);
document.getElementById("dial").addEventListener("input", event => {
	let value = event.target.value;
	setVolume(value);
});

Object.assign(window, {
	debug,
	onload,
	togglePower,
	theme,
	fly,
	handleClick,
	fullscreen
});
