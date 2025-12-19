import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder } from "@babylonjs/core";
import {KeyboardInput} from "./Input/KeyboardInput";
import {InputStrategy} from "./Input/InputStrategy";

class App {
    constructor() {

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

        // initialize babylon scene and engine
        const engine = new Engine(canvas, true);
        const scene = new Scene(engine);

        let camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(canvas, true);
        let light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        let sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

        const input: InputStrategy = new KeyboardInput().attach();

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.code === "KeyI") {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show().then(() => {});
                }
            }
        });

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
            input.update();
        });
    }
}

new App();