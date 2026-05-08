import {Game} from "./Game";
import {SoundScreenState} from "./States/SoundScreenState";
import {DialogStateTest} from "./States/Test/DialogStateTest";

export class App {
    private readonly game_: Game;

    constructor() {
        this.game_ = new Game();
        this.game_.changeState(new DialogStateTest(this.game_));
    }
}

new App();