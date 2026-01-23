import {Game} from "./Game";
import {SoundScreenState} from "./States/SoundScreenState";

export class App {
    private readonly game_: Game;

    constructor() {
        this.game_ = new Game();
        this.game_.changeState(new SoundScreenState(this.game_));
    }
}

new App();