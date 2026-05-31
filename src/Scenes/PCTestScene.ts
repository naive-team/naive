import {AsyncScene} from "./AsyncScene";
import {Engine, Scene, HemisphericLight, Vector3, AbstractMesh, AnimationGroup, MeshBuilder, GroundMesh} from "@babylonjs/core";
import {Player} from "../Entities/Player";
import {Input} from "../Input/Input";
import {MeshLoader} from "../util/MeshLoader";
import {EntityManager} from "../Entities/util/EntityManager";
import {PC} from "../Entities/PC";
import {SceneStateMachine} from "../States/SceneStates/StateMachine/SceneStateMachine";
import {SceneStatePlaying} from "../States/SceneStates/SceneStatePlaying";
import {GameContext} from "../util/GameContext";
import {PlayerCamera} from "../util/PlayerCamera";

export class PCTestScene extends Scene implements AsyncScene {
    private player_: Player;
    private input_: Input;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];

    private pcMesh_: AbstractMesh;

    private pc_: PC;
    private entityManager_: EntityManager;

    private sceneStateMachine_: SceneStateMachine;

    private gameContext_: GameContext;



    constructor(engine: Engine) {
        super(engine);
    }

    async waitUntilReady(): Promise<void> {
        const playerMeshData = await MeshLoader.loadMesh("./naru_v2.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerAnimations_ = playerMeshData.animationGroups;

        const pcMeshData = await MeshLoader.loadMesh("./pc_v2.glb", this);
        this.pcMesh_ = pcMeshData.mesh;
    }

    start(canvas: HTMLCanvasElement): boolean {
        const light = new HemisphericLight("Hemilight", new Vector3(0, 1, 0));
        const ground: GroundMesh = MeshBuilder.CreateGround("ground", {width: 6, height: 6}, this);
        ground.checkCollisions = true;

        this.entityManager_ = new EntityManager();
        this.sceneStateMachine_ = new SceneStateMachine(new SceneStatePlaying());

        this.input_ = new Input(this);

        const playerCamera: PlayerCamera = new PlayerCamera(canvas, "player_camera", 0, 0, 10, Vector3.Zero(), this);



        this.pc_ = new PC(this.pcMesh_);
        this.entityManager_.add(this.pc_);

        this.gameContext_ = new GameContext(this.entityManager_, this.input_, playerCamera, canvas);

        this.player_ = new Player(this.gameContext_, this, this.playerMesh_, this.playerAnimations_);
        this.entityManager_.add(this.player_);

        return true;
    }

    update(): void {
        this.sceneStateMachine_.update(this.gameContext_);
    }
}