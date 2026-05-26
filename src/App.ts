import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Engine} from "@babylonjs/core";
import {AsyncScene} from "./Scenes/AsyncScene";
import {PCTestScene} from "./Scenes/PCTestScene";

import {CommandTestScene} from "./Scenes/CommandTestScene";

function createCanvas() {
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.id = "gameCanvas";
	document.body.appendChild(canvas);
	return canvas;
}

class App {
	private scene_: AsyncScene;
	private canvas_: HTMLCanvasElement;
	private engine_: Engine;

	constructor() {
		this.canvas_ = createCanvas();
		this.engine_ = new Engine(this.canvas_, true);
		this.initDebugLayer_();

		this.scene_ = new CommandTestScene(this.engine_);

		this.scene_.onPointerDown = () => {
			this.engine_.enterPointerlock();
		};

		this.start_();

	}

	private initDebugLayer_() {
		window.addEventListener("keydown", (ev) => {
			// Shift+Ctrl+Alt+I
			if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
				if (this.scene_.debugLayer.isVisible()) {
					this.scene_.debugLayer.hide();
				} else {
					this.scene_.debugLayer.show();
				}
			}

			if (ev.code === "Space") {
				ev.preventDefault();
			}
		});
	}

	private async init_(): Promise<void> {
		await this.scene_.waitUntilReady();
		this.scene_.start(this.canvas_);
	}

	private async start_(): Promise<void> {
		await this.init_();

		this.engine_.runRenderLoop(() => {
			this.scene_.render();
			this.scene_.update();
		});
	}
}

new App();
