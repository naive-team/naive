import { Engine, Scene, Camera, FreeCamera, Vector3, Texture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Image, Button, TextBlock, Control } from "@babylonjs/gui";
import { AsyncScene } from "./AsyncScene";
import {VideoScene} from "../util/VideoCinematic/VideoScene";
import {SceneManager} from "./SceneManager";
import {LabScene} from "./LabScene";
import {ActivezLeSon} from "./ActivezLeSon";

export class TitleScreenScene extends Scene implements AsyncScene {
    private engine_: Engine;
    private onNextScene_: () => Promise<void>;
    private imageUrl_: string;
    private sceneManager_: SceneManager;

    constructor(engine: Engine, sceneManager: SceneManager, imageUrl: string = "/title screen.png") {
        super(engine);
        this.engine_ = engine;
        this.imageUrl_ = imageUrl;
        this.sceneManager_ = sceneManager;
        this.onNextScene_ = async () => {

            await sceneManager.switchTo(new ActivezLeSon(engine, sceneManager));

        };
    }

    start(_canvas: HTMLCanvasElement): boolean {
        // Caméra obligatoire pour que Babylon rende la scène
        const camera = new FreeCamera("camera", new Vector3(0, 0, -1), this);
        camera.setTarget(Vector3.Zero());

        // GUI fullscreen
        const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this);

        gui.background = "#fffee4";

        // Image centrée
        const img = new Image("activezSon", this.imageUrl_);
        img.width = "100%";
        img.height = "100%";
        img.verticalAlignment = Control.VERTICAL_ALIGNMENT_CENTER;
        gui.addControl(img);

        // Bouton "Continuer"
        const btn = Button.CreateSimpleButton("btnNext", "Cliquer pour commencer");
        btn.width = "100%";
        btn.height = "100%";
        btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        btn.textBlock.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        btn.textBlock.top = "100px"
        btn.color = "#ffffff";
        btn.cornerRadius = 8;
        btn.fontFamily = "courier new"
        btn.fontSize = 25;
        btn.fontWeight = "bold";
        btn.pointerDownAnimation = null;
        btn.onPointerClickObservable.add(async() => {
            await this.onNextScene_();
        });
        gui.addControl(btn);

        return true;
    }

    update(): void {}

    async waitUntilReady(): Promise<void> {
        return new Promise((resolve) => {
            // Attend que la texture de l'image soit chargée
            Texture.WhenAllReady([new Texture(this.imageUrl_, this)], () => resolve());
        });
    }
}