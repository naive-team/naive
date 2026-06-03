import {
    Mesh, Scene, VideoTexture, MeshCreationOptions, MeshBuilder, StandardMaterial, ITimerOptions, setAndStartTimer,
    Color3
} from '@babylonjs/core';
import { IVideoMesh } from './IVideoMesh';
import { Printer } from '../Printer/Printer';
import { PrinterTag } from '../Printer/PrinterTag';

export class VideoMesh extends Mesh implements IVideoMesh {
    private loaded_: boolean;
    private videoTexture_: VideoTexture;

    private scene_: Scene;
    private onEnded_: () => void;

    private readonly ready_: Promise<void>;

    constructor(name: string, src: string | string[] | HTMLVideoElement, scene: Scene, onLoaded?: () => void, onEnded?: () => void) {
        const meshCreationOptions: MeshCreationOptions = {
            source: MeshBuilder.CreatePlane("screen", {height:1, width:1})
        } 

        super(name, scene, meshCreationOptions);

        let resolveReady: () => void;

        this.ready_ = new Promise<void>((resolve) => {
            resolveReady = resolve;
        });

        this.scene_ = scene;
        this.onEnded_ = onEnded;
        
        const videoTexture: VideoTexture = new VideoTexture(name, src, scene);

        videoTexture.onLoadObservable.add(() => {
            this.loaded_ = true;

            const video: HTMLVideoElement = videoTexture.video;

            this.initVideo_(video, scene, videoTexture);
            
            if (onLoaded) onLoaded();

            resolveReady();
        });
    }
    
    waitUntilReady(): Promise<void> {
        console.log("entre wait until ready", this.ready_)
        if (this.loaded_) {
            return Promise.resolve();
        }

        return this.ready_;
    }

    private initVideo_(video: HTMLVideoElement, scene: Scene, videoTexture: VideoTexture) {
        const videoWidth: number = video.videoWidth;
        const videoHeight: number = video.videoHeight;
        const ratio: number = videoWidth / videoHeight;
        this.scaling.x = ratio;

        const material: StandardMaterial = new StandardMaterial("VideoMaterial", scene);
        material.diffuseTexture = videoTexture;

        material.ambientColor = new Color3(1, 1, 1);
        material.emissiveColor = new Color3(1, 1, 1);

        this.material = material;
        this.videoTexture_ = videoTexture;
    }

    start(): boolean {
        if (! this.loaded_) return false;
        this.videoTexture_.video.play();
        this.startTimer_(this.videoTexture_.video, this.scene_, this.onEnded_);
       
        Printer.print(PrinterTag.VIDEO, "Playing video");
        return true;
    }

    private stop_(): boolean {
        if (! this.loaded_) return false;
        this.videoTexture_.video.pause();

        Printer.print(PrinterTag.VIDEO, "Video stopped");
        return true;
    }

    private startTimer_(video: HTMLVideoElement, scene: Scene, onEnded: () => void): void {
        // En théorie, on ne devrait pas avoir besoin d'un timer car une vidéo html a déjà un événement onended
        // Cependant, onended semble ne pas se déclencher avec Babylon
        // On crée donc un timer de la durée de la vidéo
        Printer.print(PrinterTag.VIDEO, "video duration:", video.duration);

        const timerOptions: ITimerOptions<Scene> = {
                timeout: video.duration * 1000,
                contextObservable: scene.onBeforeRenderObservable,

                onEnded: () => {
                    Printer.print(PrinterTag.VIDEO, "video timer ended");
                    this.stop_();
                    if (onEnded) onEnded();
                }
            }

            setAndStartTimer(timerOptions);
            Printer.print(PrinterTag.VIDEO, "starting video timer");

    }
}