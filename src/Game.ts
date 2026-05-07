import {GameState} from "./States/GameState";

export class Game {
    private gameState_ : GameState;

    constructor() {}

    public changeState(gameState: GameState): void {
        //Printer.print("Changing game state...");
        if (this.gameState_) {
            this.gameState_.dispose();
        }
        this.gameState_ = gameState;
        this.gameState_.handle();
    }
}