import {Engine} from "@babylonjs/core";

export class BabylonManager {
    private static instance_: BabylonManager;
    private readonly engine_: Engine;
    private readonly canvas_: HTMLCanvasElement;

    private constructor() {
        this.canvas_ = this.createCanvas();
        this.engine_ = new Engine(this.canvas_, true);
        this.engine_.maxFPS = 60;
    }

    public static get instance(): BabylonManager {
        if (! this.instance_) {
            this.instance_ = new BabylonManager();
        }
        return this.instance_;
    }

    public get engine(): Engine {
        return this.engine_;
    }

    public get canvas(): HTMLCanvasElement {
        return this.canvas_;
    }

    private createCanvas(): HTMLCanvasElement {
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        // create the canvas HTML element and attach it to the webpage
        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        return canvas;
    }
}