import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Engine, FadeInOutBehavior} from "@babylonjs/core";
import {SceneManager} from "./Scenes/SceneManager";
import {TitleScreenScene} from "./Scenes/TitleScreenScene";
import {LabScene} from "./Scenes/LabScene";
import {CaliFaces} from "./util/CaliFaces";
import {FadeTestScene} from "./Scenes/FadeTestScene";

function createCanvas() {
	const canvas: HTMLCanvasElement = document.createElement("canvas");
	canvas.style.width = "100%";
	canvas.style.height = "100%";
	canvas.id = "gameCanvas";
	document.body.appendChild(canvas);
	return canvas;
}

class App {
	private canvas_: HTMLCanvasElement;
	private engine_: Engine;
	private sceneManager_: SceneManager;

	constructor() {
		this.canvas_ = createCanvas();
		this.engine_ = new Engine(this.canvas_, true);
		this.sceneManager_ = new SceneManager(this.engine_, this.canvas_);

		this.initDebugLayer_();
		this.loadFont_().then(() => this.start_()); // ← attendre la police
		//this.start_();

	}

	private initDebugLayer_() {
		window.addEventListener("keydown", (ev) => {
			// Shift+Ctrl+Alt+I
			if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
				const scene = this.sceneManager_.scene;
				if (scene?.debugLayer.isVisible()) {
					scene.debugLayer.hide();
				} else {
					scene?.debugLayer.show();
				}
			}

			if (ev.code === "Space") {
				ev.preventDefault();
			}
		});

	}

	private async start_(): Promise<void> {
		// Première scène
		//await this.sceneManager_.switchTo(new TitleScreenScene(this.engine_, this.sceneManager_));
		//await this.sceneManager_.switchTo(new LabScene(this.engine_, this.sceneManager_));
		await this.sceneManager_.switchTo(new FadeTestScene(this.engine_, this.sceneManager_, new LabScene(this.engine_, this.sceneManager_)));
	}
	private async loadFont_(): Promise<void> {
		await document.fonts.load("16px 'Press Start 2P'");
	}
}

new App();