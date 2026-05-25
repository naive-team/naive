import {CALISpeaker} from "../../Dialog/Speaker/CALISpeaker";
import * as GUI from "@babylonjs/gui";
import {Game} from "../../Game";
import {BabylonManager} from "../../util/BabylonManager";
import {Color4, FreeCamera, Vector3} from "@babylonjs/core";
import {GameState} from "../GameStates/GameState";


export class DialogStateTest extends GameState{
    constructor(game: Game) {
        super(game);
    }
    dispose(): void {
        // sortie
    }

    async handle(): Promise<void> {
        //entre
        let babylonManager: BabylonManager = BabylonManager.instance;
        babylonManager.engine.displayLoadingUI();
        //this.scene_.detachControl();
        this.scene_.clearColor = new Color4(0,0,0,1);

        let camera = new FreeCamera("camera", new Vector3(0, 0, 0), this.scene_);
        camera.setTarget(Vector3.Zero());


        const ui = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this.scene_);
        ui.background = "black";
        //let CALI: CALISpeaker = new CALISpeaker(ui, );
        //CALI.speak(this.scene_);

        await this.scene_.whenReadyAsync();
        babylonManager.engine.hideLoadingUI();

        babylonManager.engine.runRenderLoop(() => {
            this.scene_.render();
        });
    }

    update(): void {
        //pendant

    }

}