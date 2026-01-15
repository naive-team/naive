import {GameState} from "./GameState";
import {ArcRotateCamera, HemisphericLight, Mesh, MeshBuilder, Scene, Vector3} from "@babylonjs/core";
import {BabylonManager} from "../util/BabylonManager";
import {InputStrategy} from "../Input/InputStrategy";
import {KeyboardInput} from "../Input/KeyboardInput";
import {Printer} from "../util/Printer";
import {Game} from "../Game";

export class InGameState extends GameState {

    constructor(game: Game) {
        super(game);
    }

    public dispose(): void {
    }

    public handle(): void {
        // initialize babylon scene and engine
        let babylonManager: BabylonManager = BabylonManager.instance;
        let camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), this.scene_);
        camera.attachControl(babylonManager.canvas, true);
        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this.scene_);
        let sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, this.scene_);

        const input: InputStrategy = new KeyboardInput().attach();

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
                if (this.scene_.debugLayer.isVisible()) {
                    this.scene_.debugLayer.hide();
                } else {
                    this.scene_.debugLayer.show().then(() => {});
                }
            }
        });

        // run the main render loop
        babylonManager.engine.runRenderLoop(() => {
            this.scene_.render();
            input.update();
            Printer.print("caca");
            Printer.print("cac1");
        });
    }

    public update(): void {
    }

}