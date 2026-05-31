import {Engine, ILoadingScreen} from "@babylonjs/core";
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

    async switchTo(newScene: AsyncScene, _showLoadingUI = true): Promise<void> {
        if(_showLoadingUI) {
            this.engine_.loadingScreen = new CustomLoadingScreen(this.canvas_);
            this.engine_.displayLoadingUI();
        }
        else {
            const blackScreen: ILoadingScreen = {
                displayLoadingUI: () => {
                    this.canvas_.style.visibility = "hidden";
                },
                hideLoadingUI: () => {
                    this.canvas_.style.visibility = "visible";
                },
                loadingUIText: "",
                loadingUIBackgroundColor: "#000000",
            };
            this.engine_.loadingScreen = blackScreen;
            this.engine_.displayLoadingUI();
        }

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