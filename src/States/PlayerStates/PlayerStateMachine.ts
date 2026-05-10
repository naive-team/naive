import {PlayerState} from "./PlayerState";
import {Player} from "../../Entities/Player";
import {Input} from "../../Input/Input";

export class PlayerStateMachine {
    private currentState_: PlayerState;

    constructor(state: PlayerState) {
        this.currentState_ = state;
    }

    changeState(player: Player, state: PlayerState): void {
        this.currentState_.onLeave(player, this);
        this.currentState_ = state;
        this.currentState_.onEnter(player, this);
    };

    update(player: Player, input: Input): void {
        this.currentState_.update(player, this, input);
    };
}