import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Engine} from "@babylonjs/core";
import {AsyncScene} from "./Scenes/AsyncScene";
import {PlaceholderScene} from "./Scenes/PlaceholderScene";

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

		this.scene_ = new PlaceholderScene(this.engine_);

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