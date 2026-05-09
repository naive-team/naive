import {AsyncScene} from "./AsyncScene";
import {Engine, Scene, HemisphericLight, Vector3} from "@babylonjs/core";
import {MeshLoader} from "../MeshLoader";
import {Input} from "../Input";
import {Player} from "../Player";

export class PlaceholderScene extends Scene implements AsyncScene {
    private player_: Player;
    private input_: Input;

    constructor(engine: Engine) {
        super(engine);
    }

    async waitUntilReady(): Promise<void> {
        await MeshLoader.loadMesh("./naru.glb", this);
    }

    start(canvas: HTMLCanvasElement): boolean {
        const light = new HemisphericLight("Hemilight", new Vector3(0, 1, 0));

        this.input_ = new Input();
        this.player_ = new Player(this, this.input_, canvas);

        return true;
    }

    update(): void {
        this.player_.update();
        this.input_.update();
    }
}