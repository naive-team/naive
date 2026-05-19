import {AsyncScene} from "./AsyncScene";
import {Engine, Scene, HemisphericLight, Vector3, AbstractMesh, AnimationGroup, MeshBuilder, GroundMesh} from "@babylonjs/core";
import {Player} from "../Entities/Player";
import {Input} from "../Input/Input";
import {MeshLoader} from "../util/MeshLoader";
import {Beetle} from "../Entities/Beetle";
import {EntityManager} from "../Entities/util/EntityManager";
import {GameContext} from "../util/GameContext";

export class BugCatchTestScene extends Scene implements AsyncScene {
    private player_: Player;
    private input_: Input;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];

    private beetle_: Beetle;

    private gameContext_: GameContext;



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

        const entityManager: EntityManager = new EntityManager();

        this.input_ = new Input();
        this.player_ = new Player(this, this.input_, canvas, this.playerMesh_, this.playerAnimations_, entityManager);
        entityManager.add(this.player_);

        this.beetle_ = new Beetle();
        entityManager.add(this.beetle_)

        this.gameContext_ = new GameContext(entityManager, this.input_, this.player_);

        return true;
    }

    update(): void {
        this.player_.update(this.gameContext_);
        this.input_.update();
    }
}