import {GameState} from "./GameState";
import {
    ArcRotateCamera, AssetsManager, HavokPlugin,
    HemisphericLight, HingeConstraint, Mesh,
    PBRMaterial, PhysicsAggregate, PhysicsShapeType, Texture,
    Vector3
} from "@babylonjs/core";
import {BabylonManager} from "../util/BabylonManager";
import {Printer} from "../util/Printer/Printer";
import {Game} from "../Game";
import HavokPhysics from "@babylonjs/havok";


export class InGameState extends GameState {

    constructor(game: Game) {
        super(game);
    }

    public dispose(): void {
    }

    public handle(): void {
        this.initScene().then(() => {});

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
    }

    public update(): void {
    }

    private async initScene(): Promise<void> {
        let babylonManager: BabylonManager = BabylonManager.instance;
        let light: HemisphericLight = new HemisphericLight("light", new Vector3(0, 1, 0), this.scene_);
        // Default intensity is 1. Let's dim the light a small amount
        light.intensity = 0.7;

        //Adding an Arc Rotate Camera
        let camera = new ArcRotateCamera("Camera", 0, 0.8, 100, Vector3.Zero(), this.scene_);
        camera.attachControl(babylonManager.canvas, false);

        let havokInstance = await HavokPhysics();
        let hk = new HavokPlugin(true, havokInstance);

        // Enable physics in the scene with a gravity
        this.scene_.enablePhysics(new Vector3(0, -9.8, 0), hk);

        let assetsManager = new AssetsManager(this.scene_);
        let assetContainerTask = assetsManager.addContainerTask("container", "", "https://raw.githubusercontent.com/CedricGuillemet/dump/master/CharController/", "levelTest.glb");

        assetContainerTask.onSuccess = (task) => {
            task.loadedContainer.addAllToScene();
            task.loadedMeshes[0].position = Vector3.Zero();
            //Printer.print("assetContainer success");
        }

        assetsManager.onFinish = () => {
            babylonManager.engine.runRenderLoop(() => {
                this.scene_.render();
            });
        };

        let lightmap = null;
        console.log(lightmap);
        let textTask = assetsManager.addTextureTask("lightmap", "https://raw.githubusercontent.com/CedricGuillemet/dump/master/CharController/lightmap.jpg");
        textTask.onSuccess = (task) => {
            lightmap = task.texture;
            //Printer.print("texture success");
        }

        await assetsManager.loadAsync().then(() => {
            this.initLightMap(lightmap);
        });
    }

    private initLightMap(lightmap: Texture): void {
        let lightmapped = ["level_primitive0", "level_primitive1", "level_primitive2"];
        lightmapped.forEach((meshName)=> {
            let mesh = this.scene_.getMeshByName(meshName) as Mesh;
            // Create static physics shape for these particular meshes
            new PhysicsAggregate(mesh, PhysicsShapeType.MESH);
            mesh.isPickable = false;
            let mat = mesh.material as PBRMaterial;
            let lightmapTexture1: Texture;
            lightmapTexture1 = lightmap;
            lightmapTexture1.uAng = Math.PI;
            lightmapTexture1.level = 1.6;
            lightmapTexture1.coordinatesIndex = 1;
            mat.lightmapTexture = lightmapTexture1 as Texture;
            mat.useLightmapAsShadowmap = true;

            mesh.freezeWorldMatrix();
            mesh.doNotSyncBoundingInfo = true;
        });
        // static physics cubes
        let cubes = ["Cube", "Cube.001", "Cube.002", "Cube.003", "Cube.004", "Cube.005"];
        cubes.forEach((meshName)=>{
            new PhysicsAggregate(this.scene_.getMeshByName(meshName), PhysicsShapeType.BOX, {mass:0.1});
        });
        // inclined plane
        let planeMesh = this.scene_.getMeshByName("Cube.006");
        planeMesh.scaling.set(0.03,3,1);
        let fixedMass = new PhysicsAggregate(this.scene_.getMeshByName("Cube.007"), PhysicsShapeType.BOX, {mass: 0});
        let plane = new PhysicsAggregate(planeMesh, PhysicsShapeType.BOX, {mass: 0.1});

        // plane joint
        let joint = new HingeConstraint(
            new Vector3(0.75, 0, 0),
            new Vector3(-0.25, 0, 0),
            new Vector3(0, 0, -1),
            new Vector3(0, 0, 1),
            this.scene_);
        fixedMass.body.addConstraint(plane.body, joint);
    }
}