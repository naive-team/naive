import {AsyncScene} from "./AsyncScene";
import {Player} from "../Entities/Player";
import {Input} from "../Input/Input";
import {GameContext} from "../util/GameContext";
import {SceneManager} from "./SceneManager";
import {
    AbstractMesh,
    AnimationGroup,
    Engine,
    GroundMesh,
    HemisphericLight,
    Mesh,
    MeshBuilder,
    Scene,
    Vector3,
} from "@babylonjs/core";
import {MeshLoader} from "../util/MeshLoader";
import {EntityManager} from "../Entities/util/EntityManager";
import {PlayerCamera} from "../util/PlayerCamera";
import {RailFadeSequence} from "../util/RailFadeSequence";

export class FadeTestScene extends Scene implements AsyncScene {
    private player_: Player;
    private input_: Input;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];
    private gameContext_: GameContext;
    private sceneManager_: SceneManager;
    private nextScene_: AsyncScene;

    // Meshes de délimitation (pourraient aussi venir de l'extérieur si besoin)
    private startTrigger_: Mesh;
    private endPlane_: Mesh;

    // Séquence isolée
    private railFade_: RailFadeSequence;

    constructor(engine: Engine, sceneManager: SceneManager, nextScene: AsyncScene) {
        super(engine);
        this.sceneManager_ = sceneManager;
        this.nextScene_ = nextScene;
    }

    async waitUntilReady(): Promise<void> {
        const playerMeshData = await MeshLoader.loadMesh("./naru_v2.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerAnimations_ = playerMeshData.animationGroups;
        // Le shader est maintenant enregistré par RailFadeSequence — rien à faire ici.
    }

    start(canvas: HTMLCanvasElement): boolean {
        new HemisphericLight("Hemilight", new Vector3(0, 1, 0), this);

        const ground: GroundMesh = MeshBuilder.CreateGround("ground", { width: 6, height: 100 }, this);
        ground.checkCollisions = false;

        // ── Trigger de début ───────────────────────────────────────────────────
        this.startTrigger_ = MeshBuilder.CreateBox("startTrigger", { width: 6, height: 4, depth: 0.5 }, this);
        this.startTrigger_.position.z = 1;
        this.startTrigger_.isVisible  = false;
        this.startTrigger_.isPickable = false;

        // ── Plan de fin ────────────────────────────────────────────────────────
        this.endPlane_ = MeshBuilder.CreatePlane("end", {}, this);
        this.endPlane_.position.z = 50;

        // ── Entités ────────────────────────────────────────────────────────────
        const entityManager = new EntityManager();
        this.input_ = new Input(this);

        const playerCamera = new PlayerCamera(
            canvas, "player_camera", 0, 0, 10, Vector3.Zero(), this
        );

        this.gameContext_ = new GameContext(entityManager, this.input_, playerCamera, canvas);
        this.player_ = new Player(this.gameContext_, this, this.playerMesh_, this.playerAnimations_);
        entityManager.add(this.player_);

        // ── Séquence rail + fade ───────────────────────────────────────────────
        this.railFade_ = new RailFadeSequence(
            this,
            this.sceneManager_,
            this.nextScene_,
            this.player_,
            this.gameContext_,
            {
                startTrigger: this.startTrigger_,
                endPlane:     this.endPlane_,
                // railHeight et railZOffset sont optionnels (défauts : 8 et -6)
            }
        );

        return true;
    }

    update(): void {
        this.player_.update(this.gameContext_);
        this.input_.update();
        this.railFade_.update();   // toute la logique rail + fade est ici
    }
}