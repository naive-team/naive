import { Engine } from "@babylonjs/core";
import {AsyncScene} from "./AsyncScene";
import {CustomLoadingScreen} from "../util/CustomLoadingScreen";

export class SceneManager {
    private currentScene_: AsyncScene | null = null;
    private engine_: Engine;
    private canvas_: HTMLCanvasElement;

    constructor(engine: Engine, canvas: HTMLCanvasElement) {
        this.engine_ = engine;
        this.canvas_ = canvas;
        this.engine_.loadingScreen = new CustomLoadingScreen(this.canvas_);
    }

    get scene(): AsyncScene | null {
        return this.currentScene_;
    }

    async switchTo(newScene: AsyncScene): Promise<void> {
        this.engine_.displayLoadingUI();

        this.currentScene_?.dispose();
        newScene.onPointerDown = () => {
            this.engine_.enterPointerlock();
        };
        this.currentScene_ = newScene;

        await newScene.waitUntilReady();
        newScene.start(this.canvas_);

        this.engine_.stopRenderLoop();
        this.engine_.runRenderLoop(() => {
            this.currentScene_?.render();
            this.currentScene_?.update();
        });
        this.engine_.hideLoadingUI();

    }

    dispose(): void {
        this.engine_.stopRenderLoop();
        this.currentScene_?.dispose();
        this.currentScene_ = null;
    }
}