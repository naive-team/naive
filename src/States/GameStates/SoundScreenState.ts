import {GameState} from "./GameState";
import {BabylonManager} from "../../util/BabylonManager";
import {Color4, FreeCamera, Vector3} from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control, Image, Rectangle, TextBlock} from "@babylonjs/gui";
import {Game} from "../../Game";
import {InGameState} from "./InGameState";

export class SoundScreenState extends GameState {

    constructor(game: Game) {
        super(game);
    }

    dispose(): void {
        //Printer.print("dispose");
        this.scene_.dispose();
        BabylonManager.instance.engine.stopRenderLoop();
    }

    async handle(): Promise<void> {
        let babylonManager: BabylonManager = BabylonManager.instance;
        babylonManager.engine.displayLoadingUI();
        //this.scene_.detachControl();
        this.scene_.clearColor = new Color4(0,0,0,1);

        let camera = new FreeCamera("camera", new Vector3(0, 0, 0), this.scene_);
        camera.setTarget(Vector3.Zero());

        //--------GUI---------
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720;

        //
        const imageRect = new Rectangle("container");
        imageRect.width = 1;
        imageRect.thickness = 0;
        imageRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        guiMenu.addControl(imageRect);
        const logo = new Image("logo", "https://cdn.jsdelivr.net/gh/ZiaLai/Little-Sandman@main/public/textures/ls_headphones.png");
        logo.width = "256px";
        logo.height = "406px";
        logo.paddingTop = 150;
        logo.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        const imageLoadPromise = new Promise<void>((resolve) => {

            logo.onImageLoadedObservable.addOnce(() => {
                resolve();
            });

        });
        imageRect.addControl(logo);
        const text = new TextBlock("text", "Pour une meilleure expérience,\npensez à activer le son !") // TODO : si on veut décentrer vers le bas, il faut changer text alignement et block alignement sur bottom
        text.color ="white";
        text.fontStyle= "bold";
        text.fontFamily = "Trebuchet MS";
        text.fontSize = 25;
        text.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
        text.paddingTop = "150px"
        imageRect.addControl(text);
        const ok = Button.CreateSimpleButton("start", "OK");
        ok.fontFamily = "Trebuchet MS";
        ok.width = 0.05
        ok.height = "75px";
        ok.color = "white";
        ok.thickness = 0;
        ok.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        ok.paddingBottom = 25;
        ok.cornerRadius = 10;
        ok.thickness = 2;

        imageRect.addControl(ok);

        ok.onPointerDownObservable.add(async() => {
            this.game_.changeState(new InGameState(this.game_));
        });

        //--SCENE FINISHED LOADING--
        await this.scene_.whenReadyAsync();
        await imageLoadPromise;
        babylonManager.engine.hideLoadingUI();

        babylonManager.engine.runRenderLoop(() => {
            this.scene_.render();
        });
        //Printer.print("caca");

        /*
        //lastly set the current state to the start state and set the scene to the start scene
        this._scene.dispose();
        this._scene = scene;
        this._state = State.ACTIVEZ_SON;
        */
    }

    update(): void {
    }

}