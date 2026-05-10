import {PlayerState} from "./PlayerState";
import {Player} from "../../Entities/Player";
import {Input} from "../../Input/Input";
import {PlayerStateMachine} from "./PlayerStateMachine";
import {Vector3} from "@babylonjs/core";
import {PlayerIdleState} from "./PlayerIdleState";
import {SPACE} from "../../Input/Keys";
import {PlayerCatchState} from "./PlayerCatchState";

export class PlayerWalkState implements PlayerState {
    onEnter(player: Player, stateMachine: PlayerStateMachine): void {
        player.startAnimation("walk");
    }

    onLeave(player: Player, stateMachine: PlayerStateMachine): void {
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