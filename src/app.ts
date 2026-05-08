import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Engine, Scene, FreeCamera, Vector3} from "@babylonjs/core";
import {GameState} from "./GameStates/GameState";
import {Input} from "./Input";
import {Player} from "./Player";

function createCanvas() {
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.id = "gameCanvas";
	document.body.appendChild(canvas);
	return canvas;
}

class App {
	private scene_: Scene;
	private canvas_: HTMLCanvasElement;
	private engine_: Engine;
	
	constructor() {
		this.canvas_ = createCanvas();
		this.engine_ = new Engine(this.canvas_, true);
		this.initDebugLayer_();

		this.scene_ = new Scene(this.engine_);

		const camera = new FreeCamera("cam", new Vector3(0, 0, 0), this.scene_);
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

	}

	private async start_(): Promise<void> {
		await this.init_();

		const input: Input = new Input();
		const player: Player = new Player(this.scene_, input, createCanvas());

		this.engine_.runRenderLoop(() => {
			this.scene_.render();
			player.update();
			input.update();
		});
	}
}

new App();