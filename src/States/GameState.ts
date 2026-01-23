import {Scene} from "@babylonjs/core";
import {BabylonManager} from "../util/BabylonManager";
import {Game} from "../Game";

export abstract class GameState {
    protected scene_: Scene;
    protected game_: Game;

    protected constructor(game: Game) {
        this.scene_ = new Scene(BabylonManager.instance.engine);
        this.game_ = game;
    }

    public abstract handle(): void;
    public abstract update(): void;
    public abstract dispose(): void;

}