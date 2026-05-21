import {Color3, Color4, Engine, HemisphericLight, Scene, UniversalCamera, Vector3} from "@babylonjs/core";
import { VideoMesh } from "./VideoMesh";
import {AsyncScene} from "../../Scenes/AsyncScene";

export class VideoScene extends Scene implements AsyncScene {
    private video_: VideoMesh;
    private camera_: UniversalCamera;
    private isReady_: boolean;

    constructor(engine: Engine, name: string, src: string | string[] | HTMLVideoElement, cameraZ?: number, onLoaded?: () => void, onEnded?: () => void) {
        super(engine);
        this.clearColor = new Color4(0, 0, 0, 1); // noir

        const camZ = cameraZ ? cameraZ : -1.18;

        this.video_ = new VideoMesh(name, src, this, onLoaded, onEnded);
        this.camera_ = new UniversalCamera("camera", new Vector3(0, 0, camZ), this);

        const light: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), this);
        light.diffuse = new Color3(1, 1, 1);
        light.groundColor = new Color3(1, 1, 1);
        light.intensity = 1;

    }

    start(): boolean {
        if (! this.isReady_) return false;
        this.video_.start();

        return true;
    }

    public async waitUntilReady(): Promise<void> {
        await this.video_.waitUntilReady();
        this.isReady_ = true;
    }

    update(): void {
    }
}   