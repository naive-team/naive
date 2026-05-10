import {PlayerAnimationState} from "./PlayerAnimationState";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {PlayerCatchState} from "./PlayerCatchState";
import {Player} from "../../../Entities/Player";
import {Input} from "../../../Input/Input";
import {SPACE} from "../../../Input/Keys";

export class PlayerWalkState implements PlayerAnimationState {
    onEnter(player: Player, _stateMachine: PlayerStateMachine): void {
        player.startAnimation("walk");
    }

    onLeave(player: Player, _stateMachine: PlayerStateMachine): void {
        player.stopAnimation("walk");
    }

    update(player: Player, stateMachine: PlayerStateMachine, input: Input): void {
        if (input.getInputVector().equals(Vector3.Zero())) {
            stateMachine.changeState(player, new PlayerIdleState());
        }

        if (input.getPressed(SPACE)) {
            stateMachine.changeState(player, new PlayerCatchState());
        }

        player.move(input.getInputVector());
    }

}