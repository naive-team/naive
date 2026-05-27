import {
    AbstractMesh,
    AnimationGroup,
    Engine,
    GroundMesh,
    HemisphericLight,
    MeshBuilder,
    Scene,
    Vector3
} from "@babylonjs/core";
import {AsyncScene} from "./AsyncScene";
import {SceneManager} from "./SceneManager";
import {MeshLoader} from "../util/MeshLoader";
import {EntityManager} from "../Entities/util/EntityManager";
import {Input} from "../Input/Input";
import {Player} from "../Entities/Player";
import {Beetle} from "../Entities/Beetle";
import {GameContext} from "../util/GameContext";
import {PlayerCamera} from "../util/PlayerCamera";
import {CALISpeaker} from "../Dialog/Speaker/CALISpeaker";
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {SceneStateMachine} from "../States/SceneStates/StateMachine/SceneStateMachine";
import {SceneStatePlaying} from "../States/SceneStates/SceneStatePlaying";

export class LabScene extends Scene implements AsyncScene {
    private SceneManager: SceneManager;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];
    private labMesh: AbstractMesh;
    private input_: Input;
    private player_: Player;
    private gameContext_: GameContext;
    private entityManager_: EntityManager;
    private calimesh_ : AbstractMesh;
    private cali_ : CALISpeaker;

    private sceneStateMachine_: SceneStateMachine;

    constructor(engine: Engine, sceneManager: SceneManager) {
        super(engine);
        this.SceneManager = sceneManager;
        this.collisionsEnabled = true;
    }
    start(canvas: HTMLCanvasElement): boolean {
        const light = new HemisphericLight("Hemilight", new Vector3(0, 1, 0));
        for (const mesh of this.labMesh.getChildMeshes(false)){
            mesh.checkCollisions = true;

            if (mesh.name === "sol") {
                mesh.checkCollisions = false;
            }
        }


        this.entityManager_ = new EntityManager();
        this.sceneStateMachine_ = new SceneStateMachine(new SceneStatePlaying());

        this.input_ = new Input(this);

        const playerCamera: PlayerCamera = new PlayerCamera(canvas, "player_camera", 0, 0, 10, Vector3.Zero(), this);

        this.gameContext_ = new GameContext(this.entityManager_, this.input_, playerCamera, canvas);

        this.player_ = new Player(this.gameContext_, this, this.playerMesh_, this.playerAnimations_);
        this.entityManager_.add(this.player_);

        const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this);

        this.cali_ = new CALISpeaker(gui, this.calimesh_, this, this.player_.getCollider());
        this.entityManager_.add(this.cali_);

        return true;
    }

    update(): void {
        // faudra peut etre gerer l affichage des salles ici ?
        this.sceneStateMachine_.update(this.gameContext_);
    }

    async waitUntilReady(): Promise<void> {
        const playerMeshData = await MeshLoader.loadMesh("./naru_v2.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerMesh_.checkCollisions = true;
        this.playerAnimations_ = playerMeshData.animationGroups;
        const labMeshData = await MeshLoader.loadMesh("./lab.glb", this);
        this.labMesh = labMeshData.mesh;
        const calimeshdata = await MeshLoader.loadMesh("./cali.glb", this);
        this.calimesh_ = calimeshdata.mesh;
    }
}
