import {PlayerAnimationState} from "./PlayerAnimationState";

import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerWalkState} from "./PlayerWalkState";
import {PlayerCatchState} from "./PlayerCatchState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {SPACE} from "../../../Input/Keys";

export class PlayerIdleState implements PlayerAnimationState {

    constructor() {
    }

    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void {
        if (! input.getInputVector().equals(Vector3.Zero())) {
            stateMachine.changeState(player, new PlayerWalkState());
        }

        if (input.getPressed(SPACE)) {
            stateMachine.changeState(player, new PlayerCatchState());
        }
    }

    onEnter(player: Player, _stateMachine: PlayerStateMachine): void {
        player.startAnimation("idle");
    }

    onLeave(player: Player, _stateMachine: PlayerStateMachine): void {
        player.stopAnimation("idle");
    }
}