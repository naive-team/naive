import {Scene} from "@babylonjs/core";

export interface AsyncScene extends Scene {
    waitUntilReady(): Promise<void>;
    start(canvas: HTMLCanvasElement): boolean;
    update(): void;
}