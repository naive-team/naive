import { Engine, Scene, Camera, FreeCamera, Vector3, Texture } from "@babylonjs/core";
import { AdvancedDynamicTexture, Image, Button, TextBlock, Control } from "@babylonjs/gui";
import { AsyncScene } from "./AsyncScene";
import {VideoScene} from "../util/VideoCinematic/VideoScene";
import {SceneManager} from "./SceneManager";
import {LabScene} from "./LabScene";

export class ActivezLeSon extends Scene implements AsyncScene {
    private engine_: Engine;
    private onNextScene_: () => Promise<void>;
    private imageUrl_: string;
    private sceneManager_: SceneManager;

    constructor(engine: Engine, sceneManager: SceneManager, imageUrl: string = "./Pour_Une_Meilleure_Exp_Activez_Le_Son_.png") {
        super(engine);
        this.engine_ = engine;
        this.imageUrl_ = imageUrl;
        this.sceneManager_ = sceneManager;
        this.onNextScene_ = async () => {
            console.log("caca");
            const videoScene = new VideoScene(engine,
                "intro",
                "./Naive Intro V1.mp4",
                -1.18,
                ()=>{ },
                async() => {await sceneManager.switchTo(new LabScene(this.engine_, this.sceneManager_))
               ;
            });

            await sceneManager.switchTo(videoScene);

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
        const btn = Button.CreateSimpleButton("btnNext", "OK !");
        btn.width = "200px";
        btn.height = "50px";
        btn.left = "-100px"
        btn.top = "-30px"
        btn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
        btn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        btn.background = "#ee3f8d";
        btn.color = "#ffffff";
        btn.cornerRadius = 8;
        btn.fontFamily = "courier new"
        btn.fontSize = 25;
        btn.fontWeight = "bold";
        btn.onPointerClickObservable.add(async() => {
            console.log("caca 1");
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