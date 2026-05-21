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

export class LabScene extends Scene implements AsyncScene {
    private SceneManager: SceneManager;
    private playerMesh_: AbstractMesh;
    private playerAnimations_: AnimationGroup[];
    private labMesh: AbstractMesh;
    private input_: Input;
    private player_: Player;
    constructor(engine: Engine, sceneManager: SceneManager) {
        super(engine);
        this.SceneManager = sceneManager;
    }
    start(canvas: HTMLCanvasElement): boolean {
        const light = new HemisphericLight("Hemilight", new Vector3(0, 1, 0));
        for (const mesh of this.labMesh.getChildMeshes(false)){
            mesh.checkCollisions = true;
        }
        const entityManager: EntityManager = new EntityManager();

        this.input_ = new Input();
        this.player_ = new Player(this, this.input_, canvas, this.playerMesh_, this.playerAnimations_, entityManager);
        entityManager.add(this.player_);


        return true;
    }

    update(): void {
        // faudra peut etre gerer l affichage des salles ici ?
        this.player_.update();
        this.input_.update();
    }

    async waitUntilReady(): Promise<void> {
        const playerMeshData = await MeshLoader.loadMesh("./naru.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerAnimations_ = playerMeshData.animationGroups;
        const labMeshData = await MeshLoader.loadMesh("./Protolab.glb", this);
        this.labMesh = labMeshData.mesh;
    }
}
