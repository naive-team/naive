import {
    AbstractMesh, ActionManager,
    AnimationGroup, Color3, Effect,
    Engine, ExecuteCodeAction,
    HemisphericLight, Mesh,
    MeshBuilder,
    Scene, ShaderMaterial, Sound, Tools, TransformNode,
    Vector3
} from "@babylonjs/core";
import {AsyncScene} from "./AsyncScene";
import {SceneManager} from "./SceneManager";
import {MeshLoader} from "../util/MeshLoader";
import {EntityManager} from "../Entities/util/EntityManager";
import {Input} from "../Input/Input";
import {Player} from "../Entities/Player";
import {GameContext} from "../util/GameContext";
import {PlayerCamera} from "../util/PlayerCamera";
import {CALISpeaker} from "../Dialog/Speaker/CALISpeaker";
import {AdvancedDynamicTexture} from "@babylonjs/gui";
import {PC} from "../Entities/PC";
import {SceneStateMachine} from "../States/SceneStates/StateMachine/SceneStateMachine";
import {SceneStatePlaying} from "../States/SceneStates/SceneStatePlaying";
import {Firefly} from "../Entities/Firefly";
import {Door} from "../Entities/Door";
import {BugCounterFabric} from "../util/bugCounterFabric";
import {RailFadeSequence} from "../util/RailFadeSequence";
import {TitleScreenScene} from "./TitleScreenScene";
import {Block} from "../Entities/Block";
import {Button} from "../Entities/Button";
import {SecureDoor} from "../Entities/SecureDoor";
import {VideoScene} from "../util/VideoCinematic/VideoScene";

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
    private pcMesh_: AbstractMesh;
    private pc_: PC;
    private sceneStateMachine_: SceneStateMachine;
    private engine: Engine


    private fireflyMesh_: AbstractMesh;
    private railFade_: RailFadeSequence;
    private bgm_: Sound;
    private caliBgm_: Sound;
    private currentMusic_: string = "lab";


    private bgmReady_: boolean = false;
    private sceneStarted_: boolean = false;
    private bgmPlaying_: boolean = false;
    private blockMesh_: AbstractMesh;
    private buttonMesh_: AbstractMesh;

    constructor(engine: Engine, sceneManager: SceneManager) {
        super(engine);
        this.SceneManager = sceneManager;
        this.collisionsEnabled = true;
        this.engine = engine;
    }
    start(canvas: HTMLCanvasElement): boolean {


        this.sceneStarted_ = true;

        const collisionIgnored = [
            "sol", "Cylinder.004", "Cylinder.009", "sol.001", "sol.003", "sol.005",
            "sol.005", "sol.004", "Cylinder.010", "sol.012_primitive0", "sol.012_primitive1", "Cube.011"
        ];

        for (const mesh of this.labMesh.getChildMeshes(false)){
            mesh.checkCollisions = true;

            if (collisionIgnored.includes(mesh.name)) {
                mesh.checkCollisions = false;
            }

            if (mesh.name.includes("#TRIGGER")) {
                mesh.checkCollisions = false;
               // mesh.visibility = 0;
            }

            if (mesh.name.includes("#collider")) {
                mesh.isVisible = false;
            }

        }

        this.entityManager_ = new EntityManager();

        this.input_ = new Input(this);

        const playerCamera: PlayerCamera = new PlayerCamera(
            canvas, "player_camera", 0, 0, 10, Vector3.Zero(), this
        );

        this.gameContext_ = new GameContext(this.entityManager_, this.input_, playerCamera, canvas);
        this.player_ = new Player(this.gameContext_, this, this.playerMesh_, this.playerAnimations_);
        this.entityManager_.add(this.player_);

        const gui = AdvancedDynamicTexture.CreateFullscreenUI("UI", true, this);

        this.cali_ = new CALISpeaker(gui, this.calimesh_, this, this.player_.getCollider(), this.entityManager_);
        this.entityManager_.add(this.cali_);

        this.createSkydome();
        this.setLight();


        this.sceneStateMachine_ = new SceneStateMachine(new SceneStatePlaying());

        this.placePC();


        const firefly: Firefly = new Firefly(this.fireflyMesh_, "firefly", ()=>{this.cali_.setCurrentDialogIndex(3)});
        this.entityManager_.add(firefly);

        this.initDoors();

        BugCounterFabric.initialize();

        //MATRIX TEST-----------------------------------------
        /*  const matrixFx = new MatrixTextureEffect(this);
          matrixFx.applyToTextureSlot(this.calimesh_, "emissive","Face");*/
// -----------------------------------------------------

        // TODO tester...
        const MeshStart = this.labMesh.getChildMeshes().find(mesh => mesh.name === "#TRIGGER_TO_SERVER_ROOM");
        const MeshEnd = this.labMesh.getChildMeshes().find(mesh => mesh.name === "#TRIGGER_END");

        this.railFade_ = new RailFadeSequence(this,
            this.SceneManager,
            new VideoScene(this.engine,
                "badEnd",
                "./badend.mp4",
                -1.18,
                ()=>{ },
                async() => {
                await this.SceneManager.switchTo(
                    new TitleScreenScene(this.engine, this.SceneManager)
                )
                }
            ),
            this.player_,
            this.gameContext_, {
            startTrigger: MeshStart,
            endPlane:     MeshEnd,
        });

        const toDevRoomTrigger = this.labMesh.getChildMeshes(false).filter(mesh => mesh.name === "#TRIGGER_TO_DEV_ROOM")[0];

        toDevRoomTrigger.isVisible = false;

        const playerCollider = this.entityManager_.getPlayer().getCollider();

        toDevRoomTrigger.actionManager = new ActionManager(this);
        toDevRoomTrigger.actionManager.registerAction(
            new ExecuteCodeAction(
                {trigger: ActionManager.OnIntersectionEnterTrigger, parameter: playerCollider},
                (): void => {
                    this.toDevRoom_();
                    toDevRoomTrigger.actionManager.dispose();
                }
            )
        );

        this.createBlocEtButton();

        this.createSecureDoor();


        return true;
    }

    update(): void {
        // faudra peut etre gerer l affichage des salles ici ?
        this.sceneStateMachine_.update(this.gameContext_);
        this.railFade_.update();
    }

    async waitUntilReady(): Promise<void> {

        const playerMeshData = await MeshLoader.loadMesh("./naru_v2.glb", this);
        this.playerMesh_ = playerMeshData.mesh;
        this.playerMesh_.checkCollisions = true;
        this.playerAnimations_ = playerMeshData.animationGroups;

        const labMeshData = await MeshLoader.loadMesh("./lab-2.glb", this);
        this.labMesh = labMeshData.mesh;

        const calimeshdata = await MeshLoader.loadMesh("./cali.glb", this);
        this.calimesh_ = calimeshdata.mesh;

        const fireflyMeshData = await MeshLoader.loadMesh("./luluciole.glb", this);
        this.fireflyMesh_ = fireflyMeshData.mesh;

        const bgm: Sound = new Sound("LabBGM", "./old_lab.ogg", this, () => {this.bgm_.play()}, {loop: true, autoplay: false});
        this.bgm_ = bgm;

        const caliBgm: Sound = new Sound("CaliBGM", "./music/cali.ogg", this, null);
        this.caliBgm_ = caliBgm;

        const pcMeshData = await MeshLoader.loadMesh("./pc_v2.glb", this);
        this.pcMesh_ = pcMeshData.mesh;

        const blockMeshData = await MeshLoader.loadMesh("./bloc.glb", this);
        this.blockMesh_ = blockMeshData.mesh;

        const buttonMeshData = await MeshLoader.loadMesh("./button.glb", this);
        this.buttonMesh_ = buttonMeshData.mesh;
    }
    createBlocEtButton(){
        const buttonMesh1: AbstractMesh = this.getMesh_("bouton");
        const buttonMesh2: AbstractMesh = this.getMesh_("bouton.001");
        buttonMesh1.dispose();
        buttonMesh2.dispose();

        this.getMesh_("Cylinder.011")?.dispose();
        this.getMesh_("Cylinder.012")?.dispose();

        const blockRoot1: TransformNode = this.getTransformNode_("Cube.016");
        const blockRoot2: TransformNode = this.getTransformNode_("Cube.017");
        blockRoot1.dispose();
        blockRoot2.dispose();

        const block: Block = new Block(this.blockMesh_, "block1");
        const block2: Block = new Block(this.blockMesh_.clone("block2", null),"block2");

        this.entityManager_.add(block);
        this.entityManager_.add(block2);

        block.setPosition(6.4, -0.3, -6.65);
        block2.setPosition(6.52, -0.3, -15.41);

        const button1 = new Button(this.buttonMesh_, "button1");
        const button2 = new Button(this.buttonMesh_.clone("button2", null), "button2");

        this.entityManager_.add(button1);
        this.entityManager_.add(button2);

        button1.setPosition(6.5, -0.25, -9.59);
        button2.setPosition(6.5, -0.25, -12.03);
    }
    createSkydome(): void {
        // Sphère inversée couvrant toute la scène
        const skyDome = MeshBuilder.CreateSphere("skyDome", {
            diameter: 1000,
            sideOrientation: Mesh.BACKSIDE,
            segments: 8
        }, this);
        skyDome.renderingGroupId = 0;
        skyDome.isPickable = false;

        Effect.ShadersStore["forestSkyVertexShader"] = `
          precision highp float;
        attribute vec3 position;
        uniform mat4 worldViewProjection;
        varying vec3 vWorldPos;
        
        void main() {
          gl_Position = worldViewProjection * vec4(position, 1.0);
          vWorldPos = normalize(position);
  }
`;

        Effect.ShadersStore["forestSkyFragmentShader"] = `
      precision highp float;
    varying vec3 vWorldPos;
    uniform float uDensity;
    uniform float uLight;
    uniform float uScale;
    
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    
    float noise(vec2 p) {
      vec2 i = floor(p); vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1,0)), u.x),
                 mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float v = 0.0, a = 0.5;
      for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.1; a *= 0.5; }
      return v;
    }
    
    void main() {
  vec3 n = normalize(vWorldPos);
  vec2 uv;
  vec3 a = abs(n);
  if (a.y >= a.x && a.y >= a.z)
    uv = n.xz / a.y;
  else if (a.x >= a.z)
    uv = n.zy / a.x;
  else
    uv = n.xy / a.z;

  float n1 = fbm(uv * uScale * uDensity);
  float n2 = fbm(uv * uScale * uDensity * 1.7 + vec2(5.3, 1.7));
  float n3 = fbm(uv * uScale * uDensity * 2.8 + vec2(2.1, 8.4));

  float leaves = n1 * 0.5 + n2 * 0.3 + n3 * 0.2;
  float mask = smoothstep((1.0 - uLight) - 0.12, (1.0 - uLight) + 0.12, leaves);

  vec3 darkLeaf  = vec3(0.114, 0.259, 0.298); // #144850 — ombre profonde
vec3 midLeaf   = vec3(0.15, 0.45, 0.49); // #26737c — ta couleur cible
vec3 lightLeaf = vec3(0.455, 0.757, 0.525); // #389499 — lumière sur feuille
vec3 skyPeek   = vec3(0.424, 0.525, 0.486); // #2D858F — trouée teintée
vec3 sunPeek   = vec3(0.455, 0.757, 0.525); // #59B8B8 — éclat lumineux

  vec3 leafColor = mix(darkLeaf, mix(midLeaf, lightLeaf, n2), n3);
  vec3 gapColor  = mix(skyPeek, sunPeek, pow(n1, 3.0));

  leafColor = mix(leafColor * 0.55, leafColor, vWorldPos.y * 0.5 + 0.5);

  gl_FragColor = vec4(mix(gapColor, leafColor, mask), 1.0);

  }
`;

        const skyMat = new ShaderMaterial("forestFoliageSky", this, "forestSky", {
            attributes: ["position"],
            uniforms: ["worldViewProjection", "uDensity", "uLight", "uScale"]
        });
        skyMat.backFaceCulling = false;
        skyMat.disableDepthWrite = true;
        skyMat.setFloat("uDensity", 1);
        skyMat.setFloat("uLight", 0.65);
        skyMat.setFloat("uScale", 6);
        skyDome.material = skyMat;
    }
    setLight():void{
        // Récupère ou recrée la lumière hémisphérique
        const hemi = new HemisphericLight("light", new Vector3(0, 1, 0), this);

// Lumière du dessus (ciel filtré)
        hemi.diffuse = new Color3(0.424, 0.525, 0.486);   // #6c867c

// Lumière rebond du sol (sous-bois sombre)
        hemi.groundColor = new Color3(0.114, 0.259, 0.298); // #1d424c

// Ambiante légère pour éviter le noir total dans les ombres
        hemi.specular = new Color3(0.1, 0.15, 0.12);

        hemi.intensity = 0.48;
    }

    setBloom(_playerCamera: PlayerCamera): void {
        /*const bloom = new BloomEffect(this, 1.0, 1.5, 64);
        bloom.threshold = 0.1;

        // Attache le bloom uniquement à playerCamera
        this.postProcessRenderPipelineManager.addPipeline(bloom);
        this.postProcessRenderPipelineManager.attachCamerasToRenderPipeline(
            bloom._name,
            playerCamera
        );

        this.meshes.forEach(mesh => {
            if (!mesh.material) return;
            const mat = mesh.material as PBRMaterial;
            if (!mat.emissiveColor) return;
            const c = mat.emissiveColor;
            if (c.r > 0 || c.g > 0 || c.b > 0) {
                mat.emissiveIntensity = 2;
            }
        });*/
    }

    placePC(){
        this.pc_ = new PC(this.pcMesh_, this.player_.getCollider(), this);
        this.pc_.setPosition(1,0.68,7.4);
        this.entityManager_.add(this.pc_);
    }

    private toDevRoom_() {
        this.pc_.setPosition(-12, 0.65, -10.5);
        this.pc_.getCollider().rotation.y -= Tools.ToRadians(90);
        this.cali_.collider_.position = new Vector3(4,0,-10);
        this.cali_.forceCurrentDialogIndex(6);
        console.log(this.cali_.dialogGraph.currentNodeIndex);
    }

    private getMesh_(name: string): AbstractMesh {
        return this.labMesh.getChildMeshes(false).filter((m) => m.name === name)[0];
    }

    private getTransformNode_(name: string): TransformNode {
        return this.labMesh.getChildTransformNodes(false).filter((tn) => tn.name === name)[0];
    }

    public switchMusic(): void {
        switch(this.currentMusic_) {
            case "lab":
                this.bgm_.pause();
                this.caliBgm_.play();
                this.currentMusic_ = "cali";
                break;
            case "cali":
                this.caliBgm_.pause();
                this.bgm_.play();
                this.currentMusic_ = "lab";
                break;
        }
    }
    private initDoors(){
        const rightDoor: AbstractMesh = this.getMeshByName("DOOR");
        const leftDoor: AbstractMesh = this.getMeshByName("DOOR.001");

        const door: Door = new Door(
            leftDoor,
            rightDoor,
            "door_to_dev",
            ()=>{this.cali_.setCurrentDialogIndex(4)},
            ()=>{this.cali_.conditionalSetCurrentNode(3,4)},
            ()=>{this.cali_.setCurrentDialogIndex(8)}
        );
        this.entityManager_.add(door);

        const rightDoor2: AbstractMesh = this.getMeshByName("DOOR.006");
        const leftDoor2: AbstractMesh = this.getMeshByName("DOOR.007");

        const door2: Door = new Door(
            leftDoor2,
            rightDoor2,
            "door_to_serv",
            ()=>{this.cali_.setCurrentDialogIndex(10)},
            ()=>{this.cali_.forceCurrentDialogIndex(9)},
            ()=>{this.cali_.setCurrentDialogIndex(11)}
        );
        this.entityManager_.add(door2);
    }

    private createSecureDoor() {
        const secureDoorMesh: AbstractMesh = this.getMesh_("secureDoor");
        const secureDoor: SecureDoor = new SecureDoor(secureDoorMesh, "secureDoor", ()=>{this.cali_.setCurrentDialogIndex(9)});
        this.entityManager_.add(secureDoor);
    }
}
