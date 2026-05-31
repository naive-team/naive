import {PlayerAnimationState} from "./PlayerAnimationState";
import {Input} from "../../../Input/Input";
import {Player} from "../../../Entities/Player";
import {EntityManager} from "../../../Entities/util/EntityManager";

export class PlayerStateMachine {
    private currentState_: PlayerAnimationState;

    changeState(player: Player, state: PlayerAnimationState): void {
        if (this.currentState_) this.currentState_.onLeave(player, this);

        this.currentState_ = state;
        this.currentState_.onEnter(player, this);
    };

    update(player: Player, input: Input, entityManager: EntityManager): void {
        this.currentState_.update(player, this, input, entityManager);
    };
}