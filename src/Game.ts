import {GameState} from "./States/GameStates/GameState";
import {Printer} from "./util/Printer/Printer";
import {PrinterTag} from "./util/Printer/PrinterTag";


export class Game {
    private gameState_ : GameState;


    constructor() {}

    public changeState(gameState: GameState): void {
        Printer.print(PrinterTag.INPUT, "Changing game state...");
        if (this.gameState_) {
            this.gameState_.dispose();
        }
        this.gameState_ = gameState;
        this.gameState_.handle();
    }
}