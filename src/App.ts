import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import {Game} from "./Game";

class App {
    private readonly game_: Game;

    constructor() {
        this.game_ = new Game();
    }

}

new App();