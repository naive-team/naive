import {AsyncScene} from "./AsyncScene";
import {Engine, Scene, HemisphericLight, Vector3, AbstractMesh, AnimationGroup, MeshBuilder, GroundMesh} from "@babylonjs/core";
import {Player} from "../Entities/Player";
import {Input} from "../Input/Input";
import {MeshLoader} from "../util/MeshLoader";
import {Beetle} from "../Entities/Beetle";

export class PlaceholderScene extends Scene implements AsyncScene {
    private player_: Player;
    private input_: Input;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];

    private beetle: Beetle;



    constructor(engine: Engine) {
        super(engine);
    }

    async waitUntilReady(): Promise<void> {
        const playerMeshData = await MeshLoader.loadMesh("./naru.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerAnimations_ = playerMeshData.animationGroups;

    }

    start(canvas: HTMLCanvasElement): boolean {
        const light = new HemisphericLight("Hemilight", new Vector3(0, 1, 0));
        const ground: GroundMesh = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this);
        ground.checkCollisions = true;

        this.input_ = new Input();
        this.player_ = new Player(this, this.input_, canvas, this.playerMesh_, this.playerAnimations_);

        this.beetle = new Beetle();

        return true;
    }

    update(): void {
        this.player_.update();
        this.input_.update();
    }
}