import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, GamepadManager, GenericPad } from "@babylonjs/core";
import {InputStrategy} from "./Input/InputStrategies/InputStrategy";
import {GenericGamepadInput} from "./Input/InputStrategies/GenericGamepadInput";
import {InputManager} from "./Input/InputManager";

class App {
    constructor() {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);
        // initialize babylon scene and engine
        var engine = new Engine(canvas, true);
        var scene = new Scene(engine);
        var camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);

        var light1: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (scene.debugLayer.isVisible()) {
                    scene.debugLayer.hide();
                } else {
                    scene.debugLayer.show();
                }
            }
        });


        const inputManager: InputManager = new InputManager();

        // run the main render loop
        engine.runRenderLoop(() => {
            scene.render();
            inputManager.update();
        });
    }
}
new App();